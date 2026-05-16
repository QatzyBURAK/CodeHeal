import React, { useMemo } from 'react';

/**
 * CodeViewer Component
 * Displays before and after code side by side for comparison with diff highlighting
 *
 * Props:
 * - beforeCode: string - The original code
 * - afterCode: string - The fixed/improved code
 */
const CodeViewer = ({ beforeCode = '', afterCode = '' }) => {
  // Calculate differences between before and after code
  const differences = useMemo(() => {
    if (!beforeCode || !afterCode) return new Set();
    
    const beforeLines = beforeCode.split('\n');
    const afterLines = afterCode.split('\n');
    const diffLines = new Set();
    
    const maxLength = Math.max(beforeLines.length, afterLines.length);
    for (let i = 0; i < maxLength; i++) {
      if (beforeLines[i] !== afterLines[i]) {
        diffLines.add(i);
      }
    }
    
    return diffLines;
  }, [beforeCode, afterCode]);

  // Syntax highlighting for Python keywords
  const highlightSyntax = (line) => {
    const keywords = [
      'def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif',
      'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'pass',
      'break', 'continue', 'yield', 'lambda', 'and', 'or', 'not', 'in',
      'is', 'True', 'False', 'None', 'self', 'async', 'await'
    ];
    
    let highlighted = line;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/(['"])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/(#.*$)/g, '<span class="text-gray-500 italic">$1</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-blue-300">$1</span>');
    
    return highlighted;
  };

  // Helper function to add line numbers with highlighting
  const renderCodeWithLineNumbers = (code, showDiff = false) => {
    if (!code) return null;
    
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const isDifferent = showDiff && differences.has(index);
      
      return (
        <div
          key={index}
          className={`flex hover:bg-gray-800/50 ${isDifferent ? 'bg-yellow-900/10 border-l-2 border-yellow-500' : ''}`}
        >
          <span className={`inline-block w-12 text-right pr-4 select-none flex-shrink-0 ${isDifferent ? 'text-yellow-400 font-bold' : 'text-gray-500'}`}>
            {index + 1}
          </span>
          <span
            className="flex-1 whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(line || ' ') }}
          />
        </div>
      );
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Before Code */}
      <div className="flex flex-col">
        <div className="bg-gray-800 px-4 py-2 rounded-t-lg border border-gray-700 border-b-0 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Original Code
          </h3>
          <span className="text-xs text-gray-500">
            {beforeCode ? beforeCode.split('\n').length : 0} lines
          </span>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg overflow-auto max-h-[500px]">
          <pre className="p-4 text-sm font-mono text-gray-100">
            {beforeCode ? (
              renderCodeWithLineNumbers(beforeCode, true)
            ) : (
              <span className="text-gray-500 italic">No code to display</span>
            )}
          </pre>
        </div>
      </div>

      {/* After Code */}
      <div className="flex flex-col">
        <div className="bg-gray-800 px-4 py-2 rounded-t-lg border border-gray-700 border-b-0 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Fixed Code
          </h3>
          <span className="text-xs text-gray-500">
            {afterCode ? afterCode.split('\n').length : 0} lines
          </span>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg overflow-auto max-h-[500px]">
          <pre className="p-4 text-sm font-mono text-gray-100">
            {afterCode ? (
              renderCodeWithLineNumbers(afterCode, true)
            ) : (
              <span className="text-gray-500 italic">Click "Fix Code" to see the corrected version</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;

// Made with Bob
