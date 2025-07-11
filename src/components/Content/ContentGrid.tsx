import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DragStart, DragUpdate } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '../../types';
import { useAppDispatch } from '../../hooks/useAppSelector';
import { reorderContent } from '../../store/slices/dashboardSlice';
import ContentCard from './ContentCard';
import { Loader2 } from 'lucide-react';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import DragDropIndicator from './DragDropIndicator';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface ContentGridProps {
  items: ContentItem[];
  loading?: boolean;
  allowDragDrop?: boolean;
  title?: string;
  emptyMessage?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  error?: string | null;
  enableInfiniteScroll?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  items, 
  loading = false, 
  allowDragDrop = false,
  title,
  emptyMessage = "No content available",
  hasMore = false,
  onLoadMore,
  error = null,
  enableInfiniteScroll = false
}) => {
  const dispatch = useAppDispatch();
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);

  const { ref: infiniteScrollRef, loadMore } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: onLoadMore || (() => {}),
    enabled: enableInfiniteScroll && !!onLoadMore
  });

  const handleDragStart = (start: DragStart) => {
    setDraggedItemId(start.draggableId);
  };

  const handleDragUpdate = (update: DragUpdate) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedItemId(null);
    
    if (!result.destination || !allowDragDrop) return;

    const { source, destination } = result;
    
    if (source.index !== destination.index) {
      dispatch(reorderContent({
        startIndex: source.index,
        endIndex: destination.index
      }));
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-blue-500" />
        </motion.div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading content...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📭</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your preferences or check back later
        </p>
      </motion.div>
    );
  }

  const renderContent = () => {
    if (allowDragDrop) {
      return (
        <DragDropContext 
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="content-grid">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[200px] ${
                  snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <AnimatePresence>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="transition-transform duration-200"
                          style={{
                            ...provided.draggableProps.style,
                            transform: snapshot.isDragging 
                              ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                              : provided.draggableProps.style?.transform,
                          }}
                        >
                          <ContentCard 
                            item={item} 
                            index={index} 
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <DragDropIndicator isActive={!!draggedItemId} itemCount={items.length} />
        </DragDropContext>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {items.map((item, index) => (
            <ContentCard 
              key={item.id} 
              item={item} 
              index={index} 
              isDragging={false}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {items.length} items
            </span>
            {allowDragDrop && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                Drag to reorder
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Drag Drop Indicator */}
      <DragDropIndicator isActive={!!draggedItemId} itemCount={items.length} />

      {/* Content */}
      {renderContent()}

      {/* Infinite Scroll Loader */}
      {enableInfiniteScroll && (
        <div ref={infiniteScrollRef}>
          <InfiniteScrollLoader
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            error={error}
          />
        </div>
      )}
    </div>
  );
};

export default ContentGrid;