import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AccountAvatarProps {
  user: User;
  avatarUrl: string | null;
  name: string | null;
  onAvatarUpdated: (url: string) => void;
}

export const AccountAvatar = ({ user, avatarUrl, name, onAvatarUpdated }: AccountAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdated(urlData.publicUrl);
      toast.success('Profile photo updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = () => {
    if (name) {
      return name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative">
      <Avatar className="h-16 w-16 bg-gray-700 text-white">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name || "Profile"} />
        ) : null}
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <button 
        onClick={handleUploadClick}
        className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <UploadCloud size={14} />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
