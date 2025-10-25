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
    <div className={`bg-black/50 backdrop-blur-md rounded-lg border border-gray-700/50 p-4 text-white ${className}`}>
      {/* City Header */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">{city.name}</h2>
            <p className="text-gray-400 text-sm">{city.county} County</p>
          </div>
          <span className={`px-3 py-1 rounded text-xs font-bold ${getRiskColor(city.riskLevel)}`}>
            {city.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Population</div>
            <div className="text-white font-bold text-lg">
              {formatMetric(city.metrics.population, 'number')}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Median Income</div>
            <div className="text-white font-bold text-lg">
              {formatMetric(city.metrics.medianIncome, 'currency')}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
          Risk Indicators
        </h3>
        <div className="space-y-2">
          {/* Crime Rate */}
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">Crime Rate</span>
              <span className="text-white font-semibold text-sm">
                {formatMetric(city.metrics.crimeRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(city.metrics.crimeRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Foreclosure Rate */}
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">Foreclosure Rate</span>
              <span className="text-white font-semibold text-sm">
                {formatMetric(city.metrics.foreclosureRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-yellow-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(city.metrics.foreclosureRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Vacancy Rate */}
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">Vacancy Rate</span>
              <span className="text-white font-semibold text-sm">
                {formatMetric(city.metrics.vacancyRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(city.metrics.vacancyRate * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Unemployment */}
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">Unemployment</span>
              <span className="text-white font-semibold text-sm">
                {formatMetric(city.metrics.unemploymentRate, 'percentage')}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(city.metrics.unemploymentRate * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detected Problems */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
            Detected Problems
          </h3>
          <span className="text-gray-400 text-xs">
            {city.problems.length} issue{city.problems.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-2">
          {city.problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(problem.severity)}
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {problem.title}
                  </h4>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions Available */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-blue-400 font-semibold text-sm">
            {city.solutions.length} AI-Generated Solution{city.solutions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-3">
          Policy recommendations available based on successful implementations in similar cities.
        </p>
        {onViewAllProblems && (
          <button
            onClick={onViewAllProblems}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            View Problems & Solutions
          </button>
        )}
      </div>
    </div>
  );
};

export default CityDetailsPanel;
