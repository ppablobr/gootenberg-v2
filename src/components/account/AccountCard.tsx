import { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AccountAvatar } from './AccountAvatar';
import { ProfileNameEdit } from './ProfileNameEdit';

interface AccountCardProps {
  user: User;
  profile: {
    name: string | null;
    avatar_url: string | null;
  };
  onProfileUpdate: (updates: { name?: string; avatar_url?: string }) => void;
}

export const AccountCard = ({ user, profile, onProfileUpdate }: AccountCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <AccountAvatar 
            user={user} 
            avatarUrl={profile.avatar_url}
            name={profile.name}
            onAvatarUpdated={(url) => onProfileUpdate({ avatar_url: url })}
          />
          <div>
            <CardTitle className="text-2xl">Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileNameEdit 
          user={user}
          name={profile.name}
          onNameUpdated={(name) => onProfileUpdate({ name })}
        />
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-base">{user?.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};
