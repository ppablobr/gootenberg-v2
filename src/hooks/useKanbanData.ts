import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export interface KanbanItem {
  id: string;
  title?: string;
  image_url?: string;
  news_url?: string;
  source?: string;
  published_at?: string;
  position?: number;
  status?: string;
}

export interface UserProductionItem extends KanbanItem {
  isUserItem?: boolean;
  google_news_id?: string;
  content?: string;
  description?: string;
  keywords?: string;
  updated_at?: string;
}

export const useKanbanData = (user: User | null) => {
  const [newsItems, setNewsItems] = useState<KanbanItem[]>([]);
  const [userItems, setUserItems] = useState<UserProductionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all items on component mount
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setLoading(true);
        
        // Fetch Google News items
        const { data: newsData, error: newsError } = await supabase
          .from('google_news')
          .select('id, title, image_url, news_url, source, published_at, position, status')
          .order('position', { ascending: true });
        
        if (newsError) {
          throw newsError;
        }
        
        if (newsData) {
          console.log('Fetched news data:', newsData);
          
          // Set default status to 'trend' for items without a status
          const processedNewsData = newsData.map(item => ({
            ...item,
            status: item.status || 'trend'
          }));
          
          setNewsItems(processedNewsData);
        }

        // Fetch user production items if user is logged in
        if (user) {
          const { data: userProductionData, error: userProductionError } = await supabase
            .from('user_production')
            .select('id, news_title, image_url, news_url, news_source, created_at, status, google_news_id, updated_at')
            .eq('user_id', user.id);

          if (userProductionError) {
            throw userProductionError;
          }

          if (userProductionData) {
            console.log('Fetched user production data:', userProductionData);
            
            // Map user production items to KanbanItem format
            const processedUserData = userProductionData.map(item => ({
              id: item.id,
              title: item.news_title,
              image_url: item.image_url,
              news_url: item.news_url,
              source: item.news_source,
              published_at: item.created_at,
              status: item.status || 'rewrite',
              isUserItem: true,
              google_news_id: item.google_news_id,
              updated_at: item.updated_at
            }));
            
            setUserItems(processedUserData);
          }
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();

    // Set up Supabase subscription for real-time updates
    if (user) {
      const channel = supabase
        .channel(`public:user_production:user_id:${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_production', filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log('Change received!', payload);
            fetchAllItems(); // Re-fetch all items to update the state
          }
        )
        .subscribe();

      // Unsubscribe from the channel when the component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    newsItems,
    setNewsItems,
    userItems,
    setUserItems,
    loading
  };
};
