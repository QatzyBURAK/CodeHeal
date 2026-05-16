import React from 'react';

/**
 * AnalyzeButton Component
 * Reusable button with loading state
 * 
 * Props:
 * - onClick: function - Click handler
 * - loading: boolean - Shows loading spinner when true
 * - disabled: boolean - Disables the button
 * - children: node - Button text/content
 */
const AnalyzeButton = ({ 
  onClick, 
  loading = false, 
  disabled = false, 
  children = 'Analyze Code' 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-200 ease-in-out
        flex items-center justify-center gap-2
        ${disabled || loading
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
        }
      `}
    >
      {loading && (
        <svg 
          className="animate-spin h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{loading ? 'Analyzing...' : children}</span>
    </button>
  );
};

export default AnalyzeButton;

// Made with Bob
