import React from 'react';

// Define SF311 types locally to avoid import issues
export interface SF311Issue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  source: string;
  coordinates?: [number, number]; // [longitude, latitude]
  neighborhood?: string;
  metadata: Record<string, any>;
}

export interface SF311Request {
  id: string;
  offense_type: string;
  description: string;
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  neighborhood?: string;
  severity: 'high' | 'medium' | 'low';
  offense_id: string;
}

interface SF311PopupProps {
  className?: string;
  issue?: SF311Issue | null;
  request?: SF311Request | null;
  onClose?: () => void;
}

const SF311Popup: React.FC<SF311PopupProps> = ({ 
  className = '', 
  issue, 
  request, 
  onClose 
}) => {
  if (!issue && !request) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟠';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {issue ? 'SF311 Issue' : 'SF311 Request'}
              </h3>
              <p className="text-xs text-slate-400">San Francisco 311 Data</p>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {issue ? (
            <>
              {/* Issue Title */}
              <div>
                <h4 className="font-semibold text-white text-lg mb-2">{issue.title}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{issue.description}</p>
              </div>

              {/* Severity Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                  {getSeverityIcon(issue.severity)} {issue.severity.toUpperCase()} SEVERITY
                </span>
              </div>

              {/* Location Info */}
              {issue.neighborhood && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Location</span>
                  </div>
                  <p className="text-slate-300 text-sm">{issue.neighborhood}</p>
                  {issue.coordinates && (
                    <p className="text-slate-400 text-xs mt-1">
                      Coordinates: {issue.coordinates[1].toFixed(6)}, {issue.coordinates[0].toFixed(6)}
                    </p>
                  )}
                </div>
              )}

              {/* Metadata */}
              {issue.metadata && Object.keys(issue.metadata).length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Additional Info</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(issue.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-slate-300">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : request ? (
            <>
              {/* Request Type */}
              <div>
                <h4 className="font-semibold text-white text-lg mb-2">{request.offense_type}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{request.description}</p>
              </div>

              {/* Severity Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(request.severity)}`}>
                  {getSeverityIcon(request.severity)} {request.severity.toUpperCase()} SEVERITY
                </span>
              </div>

              {/* Address */}
              {request.address && (
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Address</span>
                  </div>
                  <p className="text-slate-300 text-sm">{request.address}</p>
                  {request.neighborhood && (
                    <p className="text-slate-400 text-xs mt-1">Neighborhood: {request.neighborhood}</p>
                  )}
                  {request.coordinates && (
                    <p className="text-slate-400 text-xs mt-1">
                      Coordinates: {request.coordinates[1].toFixed(6)}, {request.coordinates[0].toFixed(6)}
                    </p>
                  )}
                </div>
              )}

              {/* Request ID */}
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="text-sm font-medium text-white">Request ID</span>
                </div>
                <p className="text-slate-300 text-sm font-mono">{request.offense_id}</p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Source: SF311 Official Data</span>
            <span>Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SF311Popup;
