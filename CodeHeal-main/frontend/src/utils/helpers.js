/**
 * Helper utility functions for CodeHeal application
 */

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date = new Date()) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Count lines in code
 * @param {string} code - Code string
 * @returns {number} Number of lines
 */
export const countLines = (code) => {
  if (!code) return 0;
  return code.split('\n').length;
};

/**
 * Get severity color class
 * @param {string} severity - Severity level
 * @returns {string} Tailwind color classes
 */
export const getSeverityColor = (severity) => {
  const severityLower = severity?.toLowerCase();
  switch (severityLower) {
    case 'error':
    case 'critical':
      return 'text-red-400 bg-red-900/20 border-red-500';
    case 'warning':
      return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
    case 'info':
      return 'text-blue-400 bg-blue-900/20 border-blue-500';
    default:
      return 'text-gray-400 bg-gray-800/20 border-gray-500';
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Download text file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate Python code syntax (basic check)
 * @param {string} code - Python code
 * @returns {boolean} True if basic syntax seems valid
 */
export const validatePythonSyntax = (code) => {
  if (!code || !code.trim()) return false;
  
  // Basic checks
  const lines = code.split('\n');
  let indentLevel = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Check for basic Python keywords
    if (trimmed.match(/^(def|class|if|elif|else|for|while|try|except|finally|with)\s/)) {
      if (!trimmed.endsWith(':')) return false;
    }
  }
  
  return true;
};

/**
 * Calculate code complexity score (simple heuristic)
 * @param {string} code - Code string
 * @returns {object} Complexity metrics
 */
export const calculateComplexity = (code) => {
  if (!code) return { score: 0, level: 'none' };
  
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const functions = (code.match(/def\s+\w+/g) || []).length;
  const classes = (code.match(/class\s+\w+/g) || []).length;
  const loops = (code.match(/\b(for|while)\b/g) || []).length;
  const conditionals = (code.match(/\b(if|elif)\b/g) || []).length;
  
  const score = lines.length + (functions * 2) + (classes * 3) + (loops * 1.5) + (conditionals * 1.2);
  
  let level = 'simple';
  if (score > 100) level = 'complex';
  else if (score > 50) level = 'moderate';
  
  return {
    score: Math.round(score),
    level,
    metrics: {
      lines: lines.length,
      functions,
      classes,
      loops,
      conditionals
    }
  };
};

/**
 * Extract imports from Python code
 * @param {string} code - Python code
 * @returns {Array} List of imports
 */
export const extractImports = (code) => {
  if (!code) return [];
  
  const importRegex = /^(?:from\s+[\w.]+\s+)?import\s+[\w\s,.*]+/gm;
  const matches = code.match(importRegex) || [];
  
  return matches.map(imp => imp.trim());
};

// Made with Bob