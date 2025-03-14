import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import KanbanCardDetail from './KanbanCardDetail';
import { useAuth } from '@/context/AuthContext';
import { useKanbanData, KanbanItem, UserProductionItem } from '@/hooks/useKanbanData';
import { useKanbanOperations } from '@/hooks/useKanbanOperations';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const KanbanBoard: React.FC = () => {
  const { user } = useAuth();
  const { newsItems, setNewsItems, userItems, setUserItems, loading } = useKanbanData(user);
  const { handleCardDrop, getItemsByStatus, deleteUserItem } = useKanbanOperations(
    user,
    newsItems,
    userItems,
    setNewsItems,
    setUserItems
  );

  const [selectedItem, setSelectedItem] = useState<UserProductionItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KanbanItem | null>(null);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // Handle card click (only for review cards)
  const handleCardClick = (item: KanbanItem) => {
    // For review cards, we want to fetch the full content if it's a user item
    if (item.status === 'review' && 'isUserItem' in item && item.isUserItem) {
      fetchCardDetails(item.id);
    }
  };

  // Handle card drop with delete confirmation for "reprove" status
  const handleCardDropWithConfirmation = async (item: KanbanItem, newStatus: string) => {
    if (newStatus === 'reprove' && 'isUserItem' in item && item.isUserItem) {
      // Store the previous status for potential cancellation
      setPreviousStatus(item.status);
      setItemToDelete(item);
      setIsDeleteDialogOpen(true);
    } else {
      // For other status changes, proceed normally
      handleCardDrop(item, newStatus);
    }
  };

  // Cancel delete and move card back to previous status
  const handleCancelDelete = () => {
    if (itemToDelete && previousStatus) {
      // Move the card back to its previous status
      handleCardDrop(itemToDelete, previousStatus);
    }
    setIsDeleteDialogOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (itemToDelete && 'isUserItem' in itemToDelete && itemToDelete.isUserItem) {
      try {
        // Delete the item using the new function from useKanbanOperations
        await deleteUserItem(itemToDelete.id);
        toast.success('Card deleted successfully');
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
        
        // Move the card back to previous status on error
        if (previousStatus) {
          handleCardDrop(itemToDelete, previousStatus);
        }
      }
    }
    setIsDeleteDialogOpen(false);
  };

  // Fetch the full card details from the database
  const fetchCardDetails = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_production')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const fullItem: UserProductionItem = {
          id: data.id,
          title: data.news_title || data.title,
          image_url: data.image_url,
          news_url: data.news_url,
          source: data.news_source,
          published_at: data.created_at,
          content: data.content,
          description: data.description,
          keywords: data.keywords,
          status: data.status,
          updated_at: data.updated_at,
          isUserItem: true,
          google_news_id: data.google_news_id
        };
        
        setSelectedItem(fullItem);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching card details:', error);
      toast.error('Failed to load card details');
    }
  };

  // Handle sending to WordPress
  const handleSendToWordpress = (item: UserProductionItem) => {
    if (!user) {
      toast.error('You must be logged in to send to WordPress');
      return;
    }

    try {
      // Update status to 'send'
      handleCardDrop(item, 'send');
      setIsDetailModalOpen(false);
      toast.success('Item sent to WordPress queue');
    } catch (error) {
      console.error('Error sending to WordPress:', error);
      toast.error('Failed to send to WordPress');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading news items...</p>
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto gap-4 px-4 pb-10 pt-4 overflow-y-hidden">
            <KanbanColumn 
              title="Trend" 
              items={getItemsByStatus('trend') || []} 
              className="animate-slide-in [animation-delay:0ms]"
              status="trend"
              onDrop={handleCardDropWithConfirmation}
            />
            <KanbanColumn 
              title="Rewrite" 
              items={getItemsByStatus('rewrite') || []} 
              className="animate-slide-in [animation-delay:75ms]"
              status="rewrite"
              onDrop={handleCardDropWithConfirmation}
            />
            <KanbanColumn 
              title="Review" 
              items={getItemsByStatus('review') || []} 
              className="animate-slide-in [animation-delay:150ms]"
              status="review"
              onDrop={handleCardDropWithConfirmation}
              onCardClick={handleCardClick}
            />
            <KanbanColumn 
              title="Send to Wordpress" 
              items={getItemsByStatus('send') || []} 
              className="animate-slide-in [animation-delay:225ms]"
              status="send"
              onDrop={handleCardDropWithConfirmation}
            />
            <KanbanColumn 
              title="Published" 
              items={getItemsByStatus('published') || []} 
              className="animate-slide-in [animation-delay:300ms]"
              status="published"
              onDrop={handleCardDropWithConfirmation}
            />
            <KanbanColumn 
              title="Reprove" 
              items={getItemsByStatus('reprove') || []} 
              className="animate-slide-in [animation-delay:375ms]"
              status="reprove"
              onDrop={handleCardDropWithConfirmation}
            />
          </div>

          <KanbanCardDetail 
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            item={selectedItem}
            onSendToWordpress={handleSendToWordpress}
          />

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Card</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this card? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
