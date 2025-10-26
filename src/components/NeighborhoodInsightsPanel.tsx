import React from 'react';

// Define types locally to avoid import issues
export interface NeighborhoodInsight {
  neighborhood: string;
  total_requests: number;
  top_issue_types: Record<string, number>;
  severity_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  sample_requests: Array<{
    offense_type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    address: string;
  }>;
  llm_insights: string[];
}

interface NeighborhoodInsightsPanelProps {
  insights: NeighborhoodInsight[];
  summary: {
    total_neighborhoods: number;
    total_requests: number;
    most_active_neighborhood: string | null;
  };
  onClose: () => void;
}

const NeighborhoodInsightsPanel: React.FC<NeighborhoodInsightsPanelProps> = ({
  insights,
  summary,
  onClose
}) => {
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadgeColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="absolute left-4 top-24 z-10 w-[420px] max-h-[calc(100vh-120px)] overflow-hidden">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Neighborhood Insights</h2>
              <p className="text-slate-400 text-xs">
                AI-powered SF311 analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-slate-400 text-xs font-medium mb-1">Neighborhoods</div>
              <div className="text-purple-400 font-bold text-lg">{summary.total_neighborhoods}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs font-medium mb-1">Total Requests</div>
              <div className="text-blue-400 font-bold text-lg">{summary.total_requests}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs font-medium mb-1">Most Active</div>
              <div className="text-orange-400 font-bold text-sm">{summary.most_active_neighborhood || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Insights Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="p-4 space-y-4">
            {insights.map((insight, index) => (
              <div key={insight.neighborhood} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                {/* Neighborhood Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{insight.neighborhood}</h3>
                      <p className="text-slate-400 text-xs">{insight.total_requests} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">#{index + 1}</div>
                  </div>
                </div>

                {/* Top Issue Types */}
                <div className="mb-3">
                  <h4 className="text-slate-300 font-semibold text-sm mb-1">Top Issues</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(insight.top_issue_types).map(([issueType, count]) => (
                      <span
                        key={issueType}
                        className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600/30"
                      >
                        {issueType} ({count})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Severity Distribution */}
                <div className="mb-3">
                  <h4 className="text-slate-300 font-semibold text-sm mb-1">Severity</h4>
                  <div className="flex gap-3">
                    {Object.entries(insight.severity_distribution).map(([severity, count]) => (
                      <div key={severity} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(severity as 'high' | 'medium' | 'low')}`}></div>
                        <span className="text-slate-400 text-xs capitalize">{severity}: {count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Requests */}
                <div className="mb-3">
                  <h4 className="text-slate-300 font-semibold text-sm mb-1">Sample Requests</h4>
                  <div className="space-y-1">
                    {insight.sample_requests.map((request, reqIndex) => (
                      <div key={reqIndex} className="bg-slate-700/30 rounded p-2 border border-slate-600/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-300 font-medium text-xs">{request.offense_type}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs border ${getSeverityBadgeColor(request.severity)}`}>
                            {request.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mb-1">{request.description}</p>
                        <p className="text-slate-500 text-xs">{request.address}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LLM Insights */}
                <div>
                  <h4 className="text-slate-300 font-semibold text-sm mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Insights
                  </h4>
                  <div className="space-y-1">
                    {insight.llm_insights.map((insightText, insightIndex) => (
                      <div key={insightIndex} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded p-2 border border-purple-500/20">
                        <p className="text-slate-300 text-xs leading-relaxed">{insightText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodInsightsPanel;
