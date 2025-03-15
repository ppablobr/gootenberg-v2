import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KanbanItem, UserProductionItem } from './useKanbanData';
import { sendToWebhook, createUserProductionEntry, updateItemStatus, deleteUserProductionItem } from '@/services/kanbanService';
import { User } from '@supabase/supabase-js';

export const useKanbanOperations = (
  user: User | null,
  newsItems: KanbanItem[],
  userItems: UserProductionItem[],
  setNewsItems: React.Dispatch<React.SetStateAction<KanbanItem[]>>,
  setUserItems: React.Dispatch<React.SetStateAction<UserProductionItem[]>>
) => {
  // Function to move card to a different status
  const handleCardDrop = useCallback(
    async (item: KanbanItem, newStatus: string) => {
      const isUserItem = 'isUserItem' in item && item.isUserItem;

      // Optimistically update the UI
      if (isUserItem) {
        setUserItems(prevItems =>
          prevItems.map(i => (i.id === item.id ? { ...i, status: newStatus } : i))
        );
      } else {
        setNewsItems(prevItems =>
          prevItems.map(i => (i.id === item.id ? { ...i, status: newStatus } : i))
        );
      }

      try {
        // Update the item status in the database
        const updateSuccess = await updateItemStatus(item, newStatus, isUserItem);
        
        if (updateSuccess) {
          if (newStatus === 'rewrite' && !isUserItem) {
            // Create a user production entry when moving from trend to rewrite
            const newUserItem = await createUserProductionEntry(item, user);
            
            if (newUserItem) {
              setUserItems(prevItems => [...prevItems, {
                id: newUserItem.id,
                title: newUserItem.news_title,
                image_url: newUserItem.image_url,
                news_url: newUserItem.news_url,
                source: newUserItem.news_source,
                published_at: newUserItem.created_at,
                status: newUserItem.status || 'rewrite',
                isUserItem: true,
                google_news_id: newUserItem.google_news_id
              }]);
              
              // Remove the item from newsItems
              setNewsItems(prevItems => prevItems.filter(i => i.id !== item.id));
              
              // Send the card data to the webhook
              const itemToSend = userItems.find(i => i.id === newUserItem.id);
              
              if (itemToSend) {
                await sendToWebhook(itemToSend, 'https://n8n.gupi.com.br/webhook-test/86a4dae8-1fab-45c8-a32d-79d4ea6ba744');
              }
            }
          } else if (newStatus === 'send' && item.status === 'review' && isUserItem) {
            // Send the card data to the webhook
            const itemToSend = userItems.find(i => i.id === item.id);
            
            if (itemToSend) {
              await sendToWebhook(itemToSend, 'https://n8n.gupi.com.br/webhook-test/d487a5e5-4102-4c95-bd2c-7c5594de899c');
            }
          }
        } else {
          // If the update fails, revert the UI change
          if (isUserItem) {
            setUserItems(prevItems =>
              prevItems.map(i => (i.id === item.id ? { ...i, status: item.status } : i))
            );
          } else {
            setNewsItems(prevItems =>
              prevItems.map(i => (i.id === item.id ? { ...i, status: item.status } : i))
            );
          }
          
          toast.error('Failed to update item status');
        }
      } catch (error) {
        console.error('Error updating item status:', error);
        toast.error('Failed to update item status');
        
        // Revert the UI change on error
        if (isUserItem) {
          setUserItems(prevItems =>
            prevItems.map(i => (i.id === item.id ? { ...i, status: item.status } : i))
          );
        } else {
          setNewsItems(prevItems =>
            prevItems.map(i => (i.id === item.id ? { ...i, status: item.status } : i))
          );
        }
      }
    },
    [user, setNewsItems, setUserItems, newsItems, userItems]
  );

  // Function to get items by status
  const getItemsByStatus = (status: string) => {
    const combinedItems = [...newsItems, ...userItems];
  
    if (status === 'published') {
      return combinedItems
        .filter(item => item.status === status)
        .sort((a, b) => {
          const aUpdatedAt = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bUpdatedAt = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bUpdatedAt - aUpdatedAt;
        });
    }
  
    return combinedItems.filter(item => item.status === status);
  };

  // Function to delete a user production item
  const deleteUserItem = async (itemId: string) => {
    try {
      // Delete the item from the database
      const deleteSuccess = await deleteUserProductionItem(itemId);
      
      if (deleteSuccess) {
        // Optimistically update the UI
        setUserItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  return { handleCardDrop, getItemsByStatus, deleteUserItem };
};
