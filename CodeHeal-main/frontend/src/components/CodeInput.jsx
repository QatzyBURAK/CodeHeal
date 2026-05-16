import React from 'react';

/**
 * CodeInput Component
 * Large textarea for pasting Python code
 * 
 * Props:
 * - value: string - The current code value
 * - onChange: function - Handler for code changes
 * - placeholder: string - Placeholder text for the textarea
 */
const CodeInput = ({ value, onChange, placeholder = "Paste your Python code here..." }) => {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[300px] p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeInput;

// Made with Bob
