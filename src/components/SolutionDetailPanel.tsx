import React from 'react';
import { Solution } from '../data/mockCities';
import { X } from 'lucide-react';

interface SolutionDetailPanelProps {
  solution: Solution;
  onClose: () => void;
  onAddToReport: (solution: Solution) => void;
  isInReport: boolean;
}

const SolutionDetailPanel: React.FC<SolutionDetailPanelProps> = ({
  solution,
  onClose,
  onAddToReport,
  isInReport,
}) => {
  const categoryColors = {
    housing: 'bg-blue-500',
    economic: 'bg-green-500',
    safety: 'bg-red-500',
    environment: 'bg-emerald-500',
    infrastructure: 'bg-purple-500',
    social: 'bg-orange-500',
  };

  const categoryColor = solution.category ? categoryColors[solution.category] : 'bg-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {solution.category && (
                  <span className={`${categoryColor} text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide`}>
                    {solution.category}
                  </span>
                )}
                <span className="text-slate-400 text-sm font-medium">
                  {solution.estimatedCost}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{solution.title}</h2>
              <p className="text-slate-300 text-sm">{solution.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onAddToReport(solution)}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                isInReport
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isInReport ? '✓ Added to Report' : '+ Add to Report'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Timeline & Impact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Timeline</div>
              <div className="text-white font-semibold">{solution.timeline}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Expected Impact</div>
              <div className="text-white font-semibold">{solution.impact}</div>
            </div>
          </div>

          {/* Implementation Steps */}
          <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-400">📋</span>
              Implementation Steps
            </h3>
            <ol className="space-y-2">
              {solution.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Cost Breakdown */}
          {solution.costBreakdown && solution.costBreakdown.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-green-400">💰</span>
                Detailed Cost Breakdown
              </h3>
              <div className="space-y-2">
                {solution.costBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-0">
                    <span className="text-slate-300">{item.item}</span>
                    <span className="text-white font-semibold">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Phases */}
          {solution.implementationPhases && solution.implementationPhases.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">🗓️</span>
                Implementation Phases
              </h3>
              <div className="space-y-4">
                {solution.implementationPhases.map((phase, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/20">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded font-semibold">
                        Phase {idx + 1}
                      </span>
                      <span className="text-white font-semibold">{phase.phase}</span>
                      <span className="text-slate-400 text-sm ml-auto">{phase.duration}</span>
                    </div>
                    <ul className="ml-4 space-y-1">
                      {phase.milestones.map((milestone, mIdx) => (
                        <li key={mIdx} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-purple-400">▸</span>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {solution.successMetrics && solution.successMetrics.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-yellow-400">📊</span>
                Success Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {solution.successMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Cities Case Studies */}
          {solution.similarCities && solution.similarCities.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-cyan-400">🏙️</span>
                Case Studies from Similar Cities
              </h3>
              <div className="space-y-3">
                {solution.similarCities.map((city, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/20">
                    <div className="font-semibold text-white mb-1">{city.city}</div>
                    <div className="text-slate-300 text-sm">{city.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Departments */}
          {solution.requiredDepartments && solution.requiredDepartments.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-indigo-400">🏛️</span>
                Required Departments
              </h3>
              <div className="flex flex-wrap gap-2">
                {solution.requiredDepartments.map((dept, idx) => (
                  <span key={idx} className="bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-500/30">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders */}
          {solution.stakeholders && solution.stakeholders.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-pink-400">👥</span>
                Key Stakeholders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {solution.stakeholders.map((stakeholder, idx) => (
                  <div key={idx} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-pink-400">•</span>
                    {stakeholder}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funding Sources */}
          {solution.fundingSources && solution.fundingSources.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-emerald-400">💵</span>
                Potential Funding Sources
              </h3>
              <div className="space-y-2">
                {solution.fundingSources.map((source, idx) => (
                  <div key={idx} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-emerald-400">$</span>
                    {source}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {solution.risks && solution.risks.length > 0 && (
            <div className="bg-red-900/20 rounded-xl p-5 border border-red-700/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                Implementation Risks
              </h3>
              <div className="space-y-2">
                {solution.risks.map((risk, idx) => (
                  <div key={idx} className="text-red-200 text-sm flex gap-2">
                    <span className="text-red-400">!</span>
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionDetailPanel;
