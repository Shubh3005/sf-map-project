import React from 'react';
import { Problem, Solution, CityData } from '../data/mockCities';
import { FileText, Download, Trash2, X } from 'lucide-react';

interface ReportItem {
  problem: Problem;
  solution: Solution;
}

interface ReportBuilderProps {
  city: CityData | null;
  reportItems: ReportItem[];
  onRemoveItem: (solutionId: string) => void;
  onGeneratePDF: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  city,
  reportItems,
  onRemoveItem,
  onGeneratePDF,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 to-slate-800 border-l border-slate-700/50 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Report Builder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        {city && (
          <div className="text-blue-100 text-sm">
            {city.name}, {city.county} County
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/30">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Solutions</div>
            <div className="text-2xl font-bold text-white mt-1">{reportItems.length}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Status</div>
            <div className="text-sm font-semibold text-green-400 mt-1">
              {reportItems.length > 0 ? 'Ready' : 'Empty'}
            </div>
          </div>
        </div>
      </div>

      {/* Report Items List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {reportItems.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">
              No solutions added yet.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Click "See Solution" on any problem, then add it to your report.
            </p>
          </div>
        ) : (
          reportItems.map((item, idx) => (
            <div
              key={item.solution.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                      #{idx + 1}
                    </span>
                    {item.solution.category && (
                      <span className="text-slate-400 text-xs uppercase tracking-wide">
                        {item.solution.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {item.solution.title}
                  </h3>
                  <p className="text-slate-400 text-xs mb-2">
                    Addresses: {item.problem.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">
                      {item.solution.estimatedCost}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">
                      {item.solution.timeline}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.solution.id)}
                  className="p-2 hover:bg-red-600/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/30">
        <button
          onClick={onGeneratePDF}
          disabled={reportItems.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            reportItems.length === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/20'
          }`}
        >
          <Download className="w-5 h-5" />
          Generate PDF Report
        </button>
        {reportItems.length === 0 && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Add at least one solution to generate a report
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportBuilder;
