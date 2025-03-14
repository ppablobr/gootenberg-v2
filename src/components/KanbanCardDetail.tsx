import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { UserProductionItem } from '@/hooks/useKanbanData';
import ReadOnlyCardView from './kanban-detail/ReadOnlyCardView';
import EditCardForm from './kanban-detail/EditCardForm';
import CardDetailActions from './kanban-detail/CardDetailActions';

interface KanbanCardDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: UserProductionItem | null;
  onSendToWordpress: (item: UserProductionItem) => void;
}

const KanbanCardDetail: React.FC<KanbanCardDetailProps> = ({
  isOpen,
  onOpenChange,
  item,
  onSendToWordpress
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState<UserProductionItem | null>(null);

  // Initialize edited item when the original item changes
  React.useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!item || !editedItem) return null;

  const handleInputChange = (
    field: keyof UserProductionItem, 
    value: string
  ) => {
    setEditedItem(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleSaveChanges = () => {
    // In a real application, you would save changes to the database here
    console.log('Saving changes:', editedItem);
    setEditMode(false);
    // No longer send to WordPress automatically, just save the changes
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          {!editMode ? (
            <DialogTitle className="text-xl font-semibold">
              <div dangerouslySetInnerHTML={{ __html: editedItem.title || 'Untitled Article' }} />
            </DialogTitle>
          ) : (
            <DialogTitle className="text-xl font-semibold">Edit Article</DialogTitle>
          )}
        </DialogHeader>
        
        {editedItem.image_url && (
          <div className="w-full h-48 md:h-64 rounded-md overflow-hidden mb-4">
            <img 
              src={editedItem.image_url} 
              alt={editedItem.title || 'Article image'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          {!editMode ? (
            <ReadOnlyCardView item={editedItem} />
          ) : (
            <EditCardForm 
              item={editedItem} 
              onInputChange={handleInputChange} 
            />
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <CardDetailActions 
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            cancelEdit={() => setEditMode(false)}
            saveChanges={handleSaveChanges}
            sendToWordpress={onSendToWordpress}
            item={editedItem}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanCardDetail;
