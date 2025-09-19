import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface FloatingPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export const FloatingPreview: React.FC<FloatingPreviewProps> = ({
  isOpen,
  onClose,
  content,
  title = "Preview HTML",
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 400, height: 300 }
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX - size.width,
      y: e.clientY - size.height
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y))
      });
    } else if (isResizing) {
      setSize({
        width: Math.max(300, Math.min(800, e.clientX - dragStart.x)),
        height: Math.max(200, Math.min(600, e.clientY - dragStart.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle size={16} />
        </button>
      </div>
      <div 
        className="p-4 h-full overflow-auto relative"
        style={{ height: `calc(100% - 48px)` }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-sm min-h-full"
        />
      </div>
      
      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 hover:bg-gray-500 cursor-se-resize"
        style={{
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
        }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

export default FloatingPreview;
