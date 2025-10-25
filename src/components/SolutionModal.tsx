import React from 'react';
import type { Problem, Solution } from '../data/mockCities';
import { Button } from './ui/button';

interface SolutionModalProps {
  problem: Problem;
  solutions: Solution[];
  cityName: string;
  onClose: () => void;
  onAddToReport: (problemId: string, solutionIds: string[]) => void;
}

const SolutionModal: React.FC<SolutionModalProps> = ({
  problem,
  solutions,
  cityName,
  onClose,
  onAddToReport,
}) => {
  const [selectedSolutions, setSelectedSolutions] = React.useState<Set<string>>(new Set());

  const toggleSolution = (solutionId: string) => {
    const newSelected = new Set(selectedSolutions);
    if (newSelected.has(solutionId)) {
      newSelected.delete(solutionId);
    } else {
      newSelected.add(solutionId);
    }
    setSelectedSolutions(newSelected);
  };

  const handleAddToReport = () => {
    if (selectedSolutions.size > 0) {
      onAddToReport(problem.id, Array.from(selectedSolutions));
      onClose();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white font-bold text-xl mb-2">
                Policy Solutions for {cityName}
              </h2>
              <div className="flex items-center gap-3">
                <h3 className="text-gray-300 font-semibold">
                  {problem.title}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(problem.severity)}`}>
                  {problem.severity.toUpperCase()} SEVERITY
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Problem Context */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Problem Context
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {problem.description}
            </p>
            <div className="mt-3 flex gap-4">
              <div className="bg-gray-900/50 px-3 py-2 rounded">
                <span className="text-gray-400 text-xs">Current {problem.metric}</span>
                <p className="text-white font-bold text-lg">{problem.value}%</p>
              </div>
              <div className="bg-gray-900/50 px-3 py-2 rounded">
                <span className="text-gray-400 text-xs">Acceptable Threshold</span>
                <p className="text-white font-bold text-lg">{problem.threshold}%</p>
              </div>
              <div className="bg-gray-900/50 px-3 py-2 rounded">
                <span className="text-gray-400 text-xs">Excess</span>
                <p className="text-red-400 font-bold text-lg">+{(problem.value - problem.threshold).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* AI-Generated Solutions */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Generated Policy Recommendations
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Select one or more solutions to add to your report. Each recommendation is based on successful implementations in similar California municipalities.
            </p>
          </div>

          {/* Solutions List */}
          <div className="space-y-4">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className={`bg-gray-800/50 rounded-lg p-5 border-2 transition-all cursor-pointer ${
                  selectedSolutions.has(solution.id)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => toggleSolution(solution.id)}
              >
                {/* Solution Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedSolutions.has(solution.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedSolutions.has(solution.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-semibold text-lg mb-1">
                      {solution.title}
                    </h5>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>

                {/* Implementation Steps */}
                <div className="mb-4">
                  <h6 className="text-gray-400 text-xs font-semibold uppercase mb-2">
                    Implementation Steps
                  </h6>
                  <ol className="space-y-2">
                    {solution.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-gray-300 text-sm">
                        <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-900/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Estimated Cost</div>
                    <div className="text-white font-semibold text-sm">{solution.estimatedCost}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Timeline</div>
                    <div className="text-white font-semibold text-sm">{solution.timeline}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Expected Impact</div>
                    <div className="text-green-400 font-semibold text-sm">{solution.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            {selectedSolutions.size} solution{selectedSolutions.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToReport}
              disabled={selectedSolutions.size === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Add to Report ({selectedSolutions.size})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionModal;
