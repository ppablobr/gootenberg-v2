import React from 'react';
import { UserProductionItem } from '@/hooks/useKanbanData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from './RichTextEditor';

interface EditCardFormProps {
  item: UserProductionItem;
  onInputChange: (field: keyof UserProductionItem, value: string) => void;
}

const EditCardForm: React.FC<EditCardFormProps> = ({ item, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={item.title || ''}
          onChange={(e) => onInputChange('title', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={item.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full min-h-24 p-2 border rounded-md"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <RichTextEditor
          value={item.content || ''}
          onChange={(value) => onInputChange('content', value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          value={item.keywords || ''}
          onChange={(e) => onInputChange('keywords', e.target.value)}
        />
      </div>
    </div>
  );
};

export default EditCardForm;
