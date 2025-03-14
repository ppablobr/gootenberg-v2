import React from 'react';
import { Newspaper, Calendar, Tag } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { UserProductionItem } from '@/hooks/useKanbanData';

interface ReadOnlyCardViewProps {
  item: UserProductionItem;
}

const ReadOnlyCardView: React.FC<ReadOnlyCardViewProps> = ({ item }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      console.error('Error formatting date:', e, dateString);
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {item.description && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <div 
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      )}

      {item.content && (
        <div className="bg-white p-3 rounded-md border">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Newspaper size={16} />
            Content
          </h3>
          <div 
            className="text-sm text-gray-600 prose prose-headings:mt-2 prose-headings:mb-1 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:my-1 max-w-none" 
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.keywords && (
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Keywords
            </h3>
            <p className="text-sm text-gray-600">{item.keywords}</p>
          </div>
        )}

        {item.updated_at && (
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Last Updated
            </h3>
            <p className="text-sm text-gray-600">{formatDate(item.updated_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyCardView;
