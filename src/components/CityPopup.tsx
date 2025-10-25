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
    <div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 min-w-[360px] max-w-[440px]">
      {/* Header - Enhanced */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">{cityName}</h3>
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${getRiskColor(riskLevel)} shadow-lg`}>
              {riskLevel.toUpperCase()} RISK
            </span>
            <span className="text-slate-400 text-xs font-medium bg-slate-800/50 px-2.5 py-1 rounded-full">
              {problems.length} {problems.length === 1 ? 'Issue' : 'Issues'}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-3 hover:bg-slate-800/50 rounded-lg p-1.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Problems List - Enhanced */}
      <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-200"
          >
            {/* Problem Header - Enhanced */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-2 leading-snug">
                  {problem.title}
                </h4>
                <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${getSeverityColor(problem.severity)}`}>
                  {problem.severity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Problem Description - Enhanced */}
            <p className="text-slate-300 text-xs mb-3 leading-relaxed">
              {problem.description}
            </p>

            {/* Metric Badge - Enhanced */}
            <div className="flex items-center justify-between mb-3">
              <div className="bg-slate-900/70 px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-700/50">
                <span className="text-slate-400 text-xs font-medium">{problem.metric}:</span>
                <span className="text-white font-bold text-xs">{problem.value}%</span>
                <span className="text-slate-500 text-xs">
                  (limit: {problem.threshold}%)
                </span>
              </div>
            </div>

            {/* See Solution Button - Enhanced */}
            <button
              onClick={() => onSeeSolution(problem.id)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See Solution
            </button>
          </div>
        ))}
      </div>

      {/* Footer - Enhanced */}
      <div className="mt-5 pt-4 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs text-center font-medium">
          Click "See Solution" for AI-generated policy recommendations
        </p>
      </div>
    </div>
  );
};

export default CityPopup;
