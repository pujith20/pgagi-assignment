import React from 'react';
import { motion } from 'framer-motion';
import { Move, ArrowUpDown } from 'lucide-react';

interface DragDropIndicatorProps {
  isActive: boolean;
  itemCount: number;
}

const DragDropIndicator: React.FC<DragDropIndicatorProps> = ({ isActive, itemCount }) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <Move className="w-4 h-4" />
      </motion.div>
      <span className="text-sm font-medium">
        Drag to reorder • {itemCount} items
      </span>
      <ArrowUpDown className="w-4 h-4" />
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
    </motion.div>
  );
};

export default DragDropIndicator;