import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, ExternalLink } from 'lucide-react';

interface KanbanCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  source?: string;
  number?: number;
  className?: string;
  newsUrl?: string;
  itemData?: any;
  status?: string;
  onCardClick?: (itemData: any) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  id,
  title,
  description,
  image,
  date,
  source,
  number,
  className,
  newsUrl,
  itemData,
  status,
  onCardClick,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e, dateString);
      return dateString;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('itemId', id);
    e.dataTransfer.setData('itemData', JSON.stringify(itemData));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleClick = () => {
    // Only handle click if the card is in review status and there's a click handler
    if (status === 'review' && onCardClick && itemData) {
      onCardClick(itemData);
    }
  };

  const isReviewCard = status === 'review';
  
  // Only show external link button for trend status
  const shouldShowExternalLink = status === 'trend';

  return (
    <div
      className={cn(
        "kanban-card bg-white rounded-lg shadow-sm border border-kanban-borderGray p-4 mb-3 cursor-pointer animate-fade-in relative",
        isReviewCard && "hover:border-blue-400 hover:shadow-md transition-all duration-200",
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      data-id={id}
    >
      {status === 'published' && itemData?.wordpress_post_link && (
        <a
          href={itemData.wordpress_post_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-kanban-blue hover:text-kanban-purple transition-colors absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      )}
      {image && (
        <div className="w-full h-32 overflow-hidden rounded-md mb-3">
          <img
            src={image}
            alt={title || 'News image'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      )}

      {number !== undefined && (
        <div className="text-kanban-blue font-semibold text-sm mb-2">{number}</div>
      )}

      <h3 className="font-medium text-sm text-gray-800 leading-tight mb-2">{title || 'Untitled'}</h3>
      
      {description && (
        <p className="text-gray-600 text-sm mb-3">{description}</p>
      )}

      <div className="flex flex-col gap-1 text-xs text-gray-500 mt-2">
        <div className="flex items-center justify-between">
          {source && <div className="font-medium">{source}</div>}
          
          {newsUrl && shouldShowExternalLink && (
            <a 
              href={newsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-kanban-blue hover:text-kanban-purple transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        
        {date && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatDate(date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
