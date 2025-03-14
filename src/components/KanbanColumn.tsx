import React from 'react';
import KanbanCard from './KanbanCard';
import { cn } from '@/lib/utils';
import { KanbanItem } from '@/hooks/useKanbanData';

interface KanbanColumnProps {
  title: string;
  items: KanbanItem[];
  className?: string;
  status: string;
  onDrop: (item: KanbanItem, status: string) => void;
  onCardClick?: (item: KanbanItem) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  items,
  className,
  status,
  onDrop,
  onCardClick,
}) => {
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-kanban-dragHover');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-kanban-dragHover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-kanban-dragHover');
    
    const itemId = e.dataTransfer.getData('itemId');
    const itemData = e.dataTransfer.getData('itemData');
    
    try {
      const item = JSON.parse(itemData);
      if (item && itemId) {
        onDrop(item, status);
      }
    } catch (error) {
      console.error('Error parsing dropped item', error);
    }
  };

  return (
    <div className={cn("flex-1 min-w-[250px] px-3", className)}>
      <h2 className="font-medium text-gray-700 mb-4 text-lg">{title}</h2>
      
      <div 
        className="kanban-column bg-kanban-bgGray rounded-lg p-3 overflow-y-auto max-h-[calc(100vh-180px)]"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-lg">
            Drop cards here
          </div>
        ) : (
          items.map((item) => (
            <KanbanCard
              key={item.id}
              id={item.id}
              title={item.title || ""}
              image={item.image_url}
              date={item.published_at}
              source={item.source}
              number={item.position}
              newsUrl={item.news_url}
              itemData={item}
              status={status}
              onCardClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
