import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface ProfileNameEditProps {
  user: User;
  name: string | null;
  onNameUpdated: (name: string) => void;
}

export const ProfileNameEdit = ({ user, name, onNameUpdated }: ProfileNameEditProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateName = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name: nameInput })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      onNameUpdated(nameInput);
      setIsEditingName(false);
      toast.success('Name updated successfully');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelNameEdit = () => {
    setNameInput(name || '');
    setIsEditingName(false);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor="name" className="text-sm font-medium text-gray-500">Name</Label>
        {!isEditingName && (
          <button 
            onClick={() => setIsEditingName(true)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <Edit size={16} />
          </button>
        )}
      </div>
      {isEditingName ? (
        <div className="flex items-center gap-2">
          <Input
            id="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1"
            placeholder="Enter your name"
          />
          <button 
            onClick={handleUpdateName}
            disabled={isLoading}
            className="text-green-600 hover:text-green-800"
          >
            <Check size={18} />
          </button>
          <button 
            onClick={handleCancelNameEdit}
            className="text-red-600 hover:text-red-800"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <p className="text-base">{name || 'Not set'}</p>
      )}
    </div>
  );
};
