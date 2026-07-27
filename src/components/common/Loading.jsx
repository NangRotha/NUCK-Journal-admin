import React from 'react';

const Loading = ({ size = 'medium', fullScreen = false, message = 'Loading...' }) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${sizeMap[size]}`}></div>
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${sizeMap[size]}`}></div>
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
};

export default Loading;