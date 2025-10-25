import React from 'react';
import type { CityData } from '../data/mockCities';
import { formatMetric } from '../data/mockCities';

interface CityDetailsPanelProps {
  city: CityData;
  className?: string;
  onViewAllProblems?: () => void;
}

const CityDetailsPanel: React.FC<CityDetailsPanelProps> = ({
  city,
  className = '',
  onViewAllProblems,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-gray-900';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`text-white ${className}`}>
      {/* City Header - Enhanced */}
      <div className="mb-6 pb-5 border-b border-slate-700/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{city.name}</h2>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {city.county} County
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${getRiskColor(city.riskLevel)}`}>
            {city.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Key Metrics - Enhanced */}
      <div className="mb-6">
        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
            <div className="text-slate-400 text-xs mb-2 font-medium">Population</div>
            <div className="text-white font-bold text-xl">
              {formatMetric(city.metrics.population, 'number')}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
            <div className="text-slate-400 text-xs mb-2 font-medium">Median Income</div>
            <div className="text-white font-bold text-xl">
              {formatMetric(city.metrics.medianIncome, 'currency')}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators - Enhanced */}
      <div className="mb-6">
        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Risk Indicators
        </h3>
        <div className="space-y-3">
          {/* Crime Rate */}
          <div className="bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-xs font-medium">Crime Rate</span>
              <span className="text-white font-bold text-sm">
                {formatMetric(city.metrics.crimeRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-red-500/50"
                style={{ width: `${Math.min(city.metrics.crimeRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Foreclosure Rate */}
          <div className="bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-xs font-medium">Foreclosure Rate</span>
              <span className="text-white font-bold text-sm">
                {formatMetric(city.metrics.foreclosureRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-yellow-500/50"
                style={{ width: `${Math.min(city.metrics.foreclosureRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Vacancy Rate */}
          <div className="bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-xs font-medium">Vacancy Rate</span>
              <span className="text-white font-bold text-sm">
                {formatMetric(city.metrics.vacancyRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/50"
                style={{ width: `${Math.min(city.metrics.vacancyRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Unemployment */}
          <div className="bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-xs font-medium">Unemployment</span>
              <span className="text-white font-bold text-sm">
                {formatMetric(city.metrics.unemploymentRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                style={{ width: `${Math.min(city.metrics.unemploymentRate * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detected Problems - Enhanced */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Detected Problems
          </h3>
          <span className="text-slate-400 text-xs font-semibold bg-slate-800/50 px-2.5 py-1 rounded-full">
            {city.problems.length} issue{city.problems.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-2.5">
          {city.problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(problem.severity)}
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm leading-snug">
                    {problem.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions Available - Enhanced */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/40 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-blue-300 font-bold text-sm">
            {city.solutions.length} AI-Generated Solution{city.solutions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-slate-400 text-xs mb-4 leading-relaxed">
          Policy recommendations available based on successful implementations in similar cities.
        </p>
        {onViewAllProblems && (
          <button
            onClick={onViewAllProblems}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Problems & Solutions
          </button>
        )}
      </div>
    </div>
  );
};

export default CityDetailsPanel;
