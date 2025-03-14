import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WordPressSettings {
  id?: string;
  url: string;
  wordpress_username: string;
  password: string;
  token?: string | null;
  active?: boolean | null;
  user_id?: string | null;
  email?: string | null;
}

const WordPressSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testSuccessful, setTestSuccessful] = useState(false);
  const [settings, setSettings] = useState<WordPressSettings>({
    url: '',
    wordpress_username: '',
    password: '',
  });
  const [connectionActive, setConnectionActive] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWordPressSettings();
    }
  }, [user]);

  const fetchWordPressSettings = async () => {
    try {
      setIsLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('wordpress_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          url: data.url || '',
          wordpress_username: data.wordpress_username || '',
          password: data.password || '',
          token: data.token,
          active: data.active,
        });
        setConnectionActive(data.active || false);
        if (data.token) {
          setTestSuccessful(true);
        }
      }
    } catch (error) {
      console.error('Error fetching WordPress settings:', error);
      toast.error('Failed to load WordPress settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    
    // If we change any settings, we need to test again
    if (testSuccessful) {
      setTestSuccessful(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsTestingConnection(true);
      
      // Validate form
      if (!settings.url || !settings.wordpress_username || !settings.password) {
        toast.error('Please fill in all fields');
        return;
      }

      // Prepare payload for testing
      const payload = {
        url: settings.url,
        wordpress_username: settings.wordpress_username,
        password: settings.password,
        email: user?.email
      };

      // Send request to test webhook
      const response = await fetch('https://n8n.gupi.com.br/webhook-test/ebb37b5a-f69d-4d7a-94e6-7cc68dacf08e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Connection test failed');
      }

      const result = await response.json();
      
      // Update settings with token from response
      setSettings(prev => ({ 
        ...prev, 
        token: result.token || null 
      }));
      
      setTestSuccessful(true);
      toast.success('WordPress connection test successful!');
    } catch (error) {
      console.error('Error testing WordPress connection:', error);
      toast.error('WordPress connection test failed. Please check your credentials and try again.');
      setTestSuccessful(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveConnection = async () => {
    try {
      setIsLoading(true);
      
      if (!testSuccessful) {
        toast.error('Please test the connection first');
        return;
      }

      if (!user) {
        toast.error('You must be logged in to save WordPress settings');
        return;
      }

      // Prepare data for saving
      const wordpressData = {
        url: settings.url,
        wordpress_username: settings.wordpress_username,
        password: settings.password,
        token: settings.token,
        active: true,
        user_id: user.id,
        email: user.email
      };

      // Check if we need to update or insert
      if (settings.id) {
        // Update existing record
        const { error } = await supabase
          .from('wordpress_settings')
          .update(wordpressData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('wordpress_settings')
          .insert([wordpressData]);

        if (error) throw error;
      }

      setConnectionActive(true);
      toast.success('WordPress connection saved successfully!');
      
      // Refresh settings after save
      fetchWordPressSettings();
    } catch (error) {
      console.error('Error saving WordPress settings:', error);
      toast.error('Failed to save WordPress settings');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWordPress = async () => {
    try {
      setIsLoading(true);
      
      if (!settings.id || !user) {
        toast.error('No active connection to disconnect');
        return;
      }

      const { error } = await supabase
        .from('wordpress_settings')
        .update({ active: false, token: null })
        .eq('id', settings.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setConnectionActive(false);
      setTestSuccessful(false);
      toast.success('WordPress disconnected successfully');
      
      // Refresh settings
      fetchWordPressSettings();
    } catch (error) {
      console.error('Error disconnecting WordPress:', error);
      toast.error('Failed to disconnect WordPress');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate('/account')}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Account
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">WordPress Connection</CardTitle>
              <CardDescription>Connect and manage your WordPress integration</CardDescription>
            </div>
            {connectionActive && (
              <Badge variant="success" className="bg-green-500">
                Active
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  WordPress Site URL
                </label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://yourblog.wordpress.com"
                  value={settings.url}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="wordpress_username" className="text-sm font-medium">
                  WordPress Username
                </label>
                <Input
                  id="wordpress_username"
                  name="wordpress_username"
                  type="text"
                  placeholder="Your WordPress username"
                  value={settings.wordpress_username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  WordPress Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your WordPress password"
                  value={settings.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-0">
            <Button
              onClick={testConnection}
              disabled={isTestingConnection || isLoading || !settings.url || !settings.wordpress_username || !settings.password}
              className="w-full sm:w-auto"
              variant="outline"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button
              onClick={saveConnection}
              disabled={isLoading || !testSuccessful}
              className="w-full sm:w-auto"
            >
              {testSuccessful && <Check size={16} className="mr-2" />}
              Save Connection
            </Button>
            
            {connectionActive && (
              <Button
                onClick={disconnectWordPress}
                disabled={isLoading}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Disconnect
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WordPressSettings;
