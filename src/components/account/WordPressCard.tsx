import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GlobeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const WordPressCard = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkWordPressConnection();
    }
  }, [user]);

  const checkWordPressConnection = async () => {
    try {
      setIsLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('wordpress_settings')
        .select('active')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setIsActive(data?.active || false);
    } catch (error) {
      console.error('Error checking WordPress connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">WordPress Connection</CardTitle>
        {isActive && !isLoading && (
          <Badge variant="success" className="bg-green-500">
            Active
          </Badge>
        )}
      </CardHeader>
      <CardContent className="py-4">
        <Button 
          variant="outline" 
          className="w-full" 
          asChild
        >
          <Link to="/wordpress-settings">
            <GlobeIcon className="mr-2" size={16} />
            Manage WordPress Connection
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
