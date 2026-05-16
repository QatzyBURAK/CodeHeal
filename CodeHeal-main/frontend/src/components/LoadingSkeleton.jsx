import React from 'react';

/**
 * LoadingSkeleton Component
 * Displays loading placeholder animations
 * 
 * Props:
 * - type: string - Type of skeleton (table, code, card)
 */
const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex gap-4">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-700 rounded flex-1"></div>
          </div>
          {/* Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-3 bg-gray-800 rounded w-16"></div>
              <div className="h-3 bg-gray-800 rounded w-24"></div>
              <div className="h-3 bg-gray-800 rounded w-20"></div>
              <div className="h-3 bg-gray-800 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'code') {
    return (
      <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-3 bg-gray-700 rounded w-8"></div>
              <div className="h-3 bg-gray-800 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-800 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

// Made with Bob