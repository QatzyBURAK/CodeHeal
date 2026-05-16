import React, { useState, useMemo } from 'react';

/**
 * ResultsTable Component
 * Displays analysis results in a table format with sorting and filtering
 *
 * Props:
 * - results: array - Array of objects with { line, type, severity, message/description }
 */
const ResultsTable = ({ results = [] }) => {
  const [sortField, setSortField] = useState('line');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Severity color mapping
  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase();
    switch (severityLower) {
      case 'error':
      case 'critical':
        return 'text-red-400 bg-red-900/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'info':
        return 'text-blue-400 bg-blue-900/20';
      default:
        return 'text-gray-400 bg-gray-800/20';
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort results
  const processedResults = useMemo(() => {
    let filtered = [...results];

    // Apply severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(
        (result) => result.severity?.toLowerCase() === filterSeverity.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle different data types
      if (sortField === 'line') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, sortField, sortDirection, filterSeverity]);

  // Get unique severity levels
  const severityLevels = useMemo(() => {
    const levels = new Set(results.map((r) => r.severity?.toLowerCase()).filter(Boolean));
    return ['all', ...Array.from(levels)];
  }, [results]);

  if (results.length === 0) {
    return (
      <div className="w-full p-8 bg-gray-900 border border-gray-700 rounded-lg text-center">
        <p className="text-gray-400 text-lg">No results yet</p>
        <p className="text-gray-500 text-sm mt-2">Analyze your code to see results here</p>
      </div>
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <label className="text-sm text-gray-300 font-medium">Filter by Severity:</label>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {severityLevels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">
          Showing {processedResults.length} of {results.length} issues
        </span>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th
                onClick={() => handleSort('line')}
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Line <SortIcon field="line" />
              </th>
              <th
                onClick={() => handleSort('type')}
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Type <SortIcon field="type" />
              </th>
              <th
                onClick={() => handleSort('severity')}
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Severity <SortIcon field="severity" />
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {processedResults.map((result, index) => (
              <tr
                key={index}
                className="hover:bg-gray-800/70 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                  {result.line}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {result.description || result.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;

// Made with Bob
