import React from 'react';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProductionItem } from '@/hooks/useKanbanData';

interface CardDetailActionsProps {
  editMode: boolean;
  toggleEditMode: () => void;
  cancelEdit: () => void;
  saveChanges: () => void;
  sendToWordpress: (item: UserProductionItem) => void;
  item: UserProductionItem;
}

const CardDetailActions: React.FC<CardDetailActionsProps> = ({
  editMode,
  toggleEditMode,
  cancelEdit,
  saveChanges,
  sendToWordpress,
  item
}) => {
  return (
    <>
      {!editMode ? (
        <>
          <Button
            variant="outline"
            onClick={toggleEditMode}
            className="gap-2"
          >
            <Edit size={16} />
            Edit
          </Button>
          <Button 
            onClick={() => sendToWordpress(item)} 
            className="gap-2"
          >
            Send to Wordpress
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={cancelEdit}
            className="gap-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={saveChanges}
            className="gap-2"
          >
            <Save size={16} />
            Save Changes
          </Button>
        </>
      )}
    </>
  );
};

export default CardDetailActions;
