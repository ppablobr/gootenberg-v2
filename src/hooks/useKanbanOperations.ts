import { useState } from 'react';
import { KanbanItem, UserProductionItem } from './useKanbanData';
import { 
  sendToWebhook, 
  createUserProductionEntry, 
  updateItemStatus, 
  fetchUpdatedUserItems,
  deleteUserProductionItem
} from '@/services/kanbanService';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export const useKanbanOperations = (
  user: User | null,
  initialNewsItems: KanbanItem[],
  initialUserItems: UserProductionItem[],
  setNewsItems: React.Dispatch<React.SetStateAction<KanbanItem[]>>,
  setUserItems: React.Dispatch<React.SetStateAction<UserProductionItem[]>>
) => {
  // Handle card drop between columns
  const handleCardDrop = async (item: KanbanItem | UserProductionItem, newStatus: string) => {
    if (!user) {
      toast.error('You must be logged in to move cards');
      return;
    }

    // Return if status hasn't changed
    if (item.status === newStatus) return;

    try {
      // Handle differently based on whether it's a google_news item or user_production item
      if ('isUserItem' in item && item.isUserItem) {
        // It's a user production item, update it in user_production table
        const updated = await updateItemStatus(item, newStatus, true);
        
        if (!updated) {
          throw new Error('Failed to update item status');
        }
        
        // Optimistically update UI
        const updatedUserItems = initialUserItems.map(userItem => 
          userItem.id === item.id ? { ...userItem, status: newStatus } : userItem
        );
        
        setUserItems(updatedUserItems);
        toast.success(`Item moved to ${newStatus}`);
        
        // If the item is being moved to 'rewrite', send it to the webhook
        if (newStatus === 'rewrite') {
          await sendToWebhook(item as UserProductionItem);
        }
      } else {
        // It's a google_news item
        if (item.status === 'trend' && newStatus === 'rewrite') {
          // Moving from trend to rewrite - create a user_production entry instead of updating google_news
          const newItem = await createUserProductionEntry(item, user);
          
          if (newItem) {
            // Send the newly created item to the webhook
            const userProductionItem: UserProductionItem = {
              id: newItem.id,
              title: newItem.news_title,
              image_url: newItem.image_url,
              news_url: newItem.news_url,
              source: newItem.news_source,
              published_at: newItem.created_at,
              status: newItem.status || 'rewrite',
              isUserItem: true,
              google_news_id: newItem.google_news_id
            };
            
            await sendToWebhook(userProductionItem);
            
            // Refresh user items after adding a new one
            if (user.id) {
              const updatedUserItems = await fetchUpdatedUserItems(user.id);
              setUserItems(updatedUserItems);
            }
          }
        } else {
          // For other moves, update the google_news item status
          const updated = await updateItemStatus(item, newStatus, false);
          
          if (!updated) {
            throw new Error('Failed to update item status');
          }
          
          // Optimistically update UI
          const updatedNewsItems = initialNewsItems.map(newsItem => 
            newsItem.id === item.id ? { ...newsItem, status: newStatus } : newsItem
          );
          
          setNewsItems(updatedNewsItems);
          toast.success(`Item moved to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('Error moving card:', error);
      toast.error('Failed to move card');
      
      // Revert UI state on error
      setNewsItems([...initialNewsItems]);
      setUserItems([...initialUserItems]);
    }
  };

  // Delete a user production item
  const deleteUserItem = async (itemId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete cards');
      return false;
    }

    try {
      // Call the service to delete the item
      const success = await deleteUserProductionItem(itemId);
      
      if (!success) {
        throw new Error('Failed to delete item');
      }
      
      // Optimistically update UI by removing the item
      const updatedUserItems = initialUserItems.filter(item => item.id !== itemId);
      setUserItems(updatedUserItems);
      
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
      return false;
    }
  };

  // Helper to filter items by status
  const getItemsByStatus = (status: string) => {
    // For "rewrite" status, show user production items instead of google_news items with that status
    if (status === 'rewrite') {
      // Exclude google_news items that the user has already moved to rewrite (by checking google_news_id)
      const userItemGoogleIds = initialUserItems.map(item => item.google_news_id);
      
      // Only include user items with rewrite status
      const filteredUserItems = initialUserItems.filter(item => item.status === 'rewrite');
      
      // For other users or if no user items exist yet, show google_news items that aren't in user items
      const filteredNewsItems = initialNewsItems.filter(item => 
        item.status === 'rewrite' && 
        !userItemGoogleIds.includes(item.id)
      );
      
      return [...filteredUserItems, ...filteredNewsItems];
    } else if (status === 'trend') {
      // For trend status, exclude items that the user has moved to rewrite
      const userItemGoogleIds = initialUserItems.map(item => item.google_news_id);
      return initialNewsItems.filter(item => 
        item.status === 'trend' && 
        !userItemGoogleIds.includes(item.id)
      );
    } else {
      // For other statuses, filter from both sources and combine
      const filteredNewsItems = initialNewsItems.filter(item => item.status === status);
      const filteredUserItems = initialUserItems.filter(item => item.status === status);
      return [...filteredUserItems, ...filteredNewsItems];
    }
  };

  return {
    handleCardDrop,
    getItemsByStatus,
    deleteUserItem
  };
};
