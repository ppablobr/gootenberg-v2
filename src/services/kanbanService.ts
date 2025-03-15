import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { KanbanItem, UserProductionItem } from '@/hooks/useKanbanData';

// Send card data to webhook
export const sendToWebhook = async (item: UserProductionItem) => {
  try {
    // Fetch the complete user_production item data
    const { data: userProductionItem, error } = await supabase
      .from('user_production')
      .select('*')
      .eq('id', item.id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!userProductionItem) {
      throw new Error('Item not found in user_production');
    }
    
    // Send the data to the webhook
    const webhookUrl = 'https://n8n.gupi.com.br/webhook-test/86a4dae8-1fab-45c8-a32d-79d4ea6ba744';
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userProductionItem),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    console.log('Successfully sent to webhook:', userProductionItem);
    toast.success('Item sent to rewrite service');
    
    return true;
  } catch (error) {
    console.error('Error sending to webhook:', error);
    toast.error('Failed to send to rewrite service');
    return false;
  }
};

// Create entry in user_production when a card is moved from trend to rewrite
export const createUserProductionEntry = async (item: KanbanItem, user: User) => {
  if (!user || !user.email) {
    console.error('User not authenticated or missing email');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_production')
      .insert({
        google_news_id: item.id,
        news_title: item.title,
        news_url: item.news_url,
        image_url: item.image_url,
        news_source: item.source,
        user_id: user.id,
        email: user.email,
        status: 'rewrite',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    // Fetch the newly created item
    const { data: newUserItem, error: fetchError } = await supabase
      .from('user_production')
      .select('id, news_title, image_url, news_url, news_source, created_at, status, google_news_id')
      .eq('google_news_id', item.id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    console.log('Created user production entry:', data);
    toast.success('Item added to your production queue');
    
    return newUserItem;
  } catch (error) {
    console.error('Error creating user production entry:', error);
    toast.error('Failed to add item to production queue');
    return null;
  }
};

// Fetch updated user items
export const fetchUpdatedUserItems = async (userId: string) => {
  try {
    const { data: newUserItems, error: fetchError } = await supabase
      .from('user_production')
      .select('id, news_title, image_url, news_url, news_source, created_at, status, google_news_id')
      .eq('user_id', userId);
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (newUserItems) {
      const processedUserData = newUserItems.map(userItem => ({
        id: userItem.id,
        title: userItem.news_title,
        image_url: userItem.image_url,
        news_url: userItem.news_url,
        source: userItem.news_source,
        published_at: userItem.created_at,
        status: userItem.status || 'rewrite',
        isUserItem: true,
        google_news_id: userItem.google_news_id
      }));
      
      return processedUserData;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching updated user items:', error);
    toast.error('Failed to refresh items');
    return [];
  }
};

// Update item status in database
export const updateItemStatus = async (
  item: KanbanItem | UserProductionItem, 
  newStatus: string,
  isUserItem: boolean
) => {
  try {
    if (isUserItem) {
      // Update user_production item
      const { error } = await supabase
        .from('user_production')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      
      if (error) {
        throw error;
      }
    } else {
      // Update google_news item
      const { error } = await supabase
        .from('google_news')
        .update({ status: newStatus })
        .eq('id', item.id);
      
      if (error) {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating item status:', error);
    return false;
  }
};

// Delete a user production item
export const deleteUserProductionItem = async (itemId: string) => {
  try {
    // Delete the item from the user_production table
    const { error } = await supabase
      .from('user_production')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully deleted item:', itemId);
    return true;
  } catch (error) {
    console.error('Error deleting user production item:', error);
    return false;
  }
};
