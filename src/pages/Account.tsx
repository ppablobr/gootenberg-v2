import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, LogOut } from 'lucide-react';

import { AccountCard } from '@/components/account/AccountCard';
import { ActionCard } from '@/components/account/ActionCard';
import { SignOutDialog } from '@/components/account/SignOutDialog';
import { WordPressCard } from '@/components/account/WordPressCard';
import { SubscriptionCard } from '@/components/account/SubscriptionCard';

interface Profile {
  name: string | null;
  avatar_url: string | null;
}

const Account: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ name: null, avatar_url: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          name: data.name,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfileUpdate = (updates: { name?: string; avatar_url?: string }) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        {/* Account Card */}
        {user && (
          <AccountCard 
            user={user} 
            profile={profile} 
            onProfileUpdate={handleProfileUpdate} 
          />
        )}

        {/* Settings Section */}
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-3">Settings</h2>
          <div className="space-y-4">
            <WordPressCard />
            <SubscriptionCard />
          </div>
        </div>

        {/* Contact Us Card */}
        <ActionCard 
          variant="outline"
          onClick={() => navigate('/contact-us')}
          icon={<MessageCircle className="mr-2" size={16} />}
          label="Contact Us"
          title="Contact"
        />

        {/* Sign Out Card */}
        <ActionCard 
          variant="destructive"
          onClick={() => setIsSignOutDialogOpen(true)}
          icon={<LogOut className="mr-2" size={16} />}
          label="Sign out"
          title="Sign Out"
        />
      </main>

      <SignOutDialog 
        isOpen={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default Account;
