import React, { useEffect, useState } from 'react';

const BottomDrawer = ({ isOpen, onClose, children, title }) => {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setDragY(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleStart = (clientY) => {
    setStartY(clientY);
    setIsDragging(true);
  };

  const handleMove = (clientY) => {
    if (!isDragging) return;
    const deltaY = clientY - startY;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  // Touch events
  const handleTouchStart = (e) => handleStart(e.touches[0].clientY);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();

  // Mouse events
  const handleMouseDown = (e) => handleStart(e.clientY);
  
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, dragY]);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black backdrop-blur-sm transition-all duration-300 ease-out ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className="fixed bottom-4 left-1/2 w-[600px] max-w-[95vw] bg-white rounded-2xl shadow-xl max-h-[90vh]"
        style={{
          transform: `translate(-50%, ${isOpen ? dragY : 100}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Drag Handle */}
        <div 
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out hover:scale-110"
            aria-label="Close drawer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomDrawer;