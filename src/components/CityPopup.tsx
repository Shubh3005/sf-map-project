import React from 'react';
import type { Problem } from '../data/mockCities';

interface CityPopupProps {
  cityName: string;
  problems: Problem[];
  riskLevel: 'high' | 'medium' | 'low';
  onSeeSolution: (problemId: string) => void;
  onClose?: () => void;
}

const CityPopup: React.FC<CityPopupProps> = ({
  cityName,
  problems,
  riskLevel,
  onSeeSolution,
  onClose
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/90';
      case 'medium': return 'bg-yellow-500/90';
      case 'low': return 'bg-green-500/90';
      default: return 'bg-gray-500/90';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 p-5 min-w-[320px] max-w-[400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">{cityName}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getRiskColor(riskLevel)}`}>
              {riskLevel.toUpperCase()} RISK
            </span>
            <span className="text-gray-400 text-xs">
              {problems.length} {problems.length === 1 ? 'Issue' : 'Issues'} Detected
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors ml-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            {/* Problem Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {problem.title}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded border ${getSeverityColor(problem.severity)}`}>
                  {problem.severity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">
              {problem.description}
            </p>

            {/* Metric Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gray-800/50 px-3 py-1.5 rounded flex items-center gap-2">
                <span className="text-gray-400 text-xs">{problem.metric}:</span>
                <span className="text-white font-semibold text-xs">{problem.value}%</span>
                <span className="text-gray-500 text-xs">
                  (threshold: {problem.threshold}%)
                </span>
              </div>
            </div>

            {/* See Solution Button */}
            <button
              onClick={() => onSeeSolution(problem.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See Solution
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <p className="text-gray-500 text-xs text-center">
          Click "See Solution" to view AI-generated policy recommendations
        </p>
      </div>
    </div>
  );
};

export default CityPopup;
