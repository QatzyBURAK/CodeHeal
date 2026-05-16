import React from 'react';

/**
 * DownloadButton Component
 * Button for downloading reports
 * 
 * Props:
 * - onClick: function - Click handler
 * - disabled: boolean - Disables the button
 * - children: node - Button text/content
 */
const DownloadButton = ({ 
  onClick, 
  disabled = false, 
  children = 'Download Report' 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-200 ease-in-out
        flex items-center justify-center gap-2
        ${disabled
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : 'bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-lg'
        }
      `}
    >
      {/* Download Icon */}
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
        />
      </svg>
      <span>{children}</span>
    </button>
  );
};

export default DownloadButton;

// Made with Bob
