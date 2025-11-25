import { FC } from 'react';
import { FileText, ShieldAlert, Wrench, Book, Activity } from 'lucide-react';
import { AnalysisResult, KTS } from '../types';
import clsx from 'clsx';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: FC<ResultCardProps> = ({ result }) => {
  const getKtsColor = (kts: string) => {
    switch (kts.toUpperCase()) {
      case KTS.I: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case KTS.II: return 'bg-blue-100 text-blue-800 border-blue-200';
      case KTS.III: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case KTS.IV: return 'bg-orange-100 text-orange-800 border-orange-200';
      case KTS.V: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="analysis-report">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-engineering-600" />
          Technical Expertise Result
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence</span>
          <div className={clsx(
            "px-2.5 py-0.5 rounded-full text-sm font-bold border",
            result.confidence > 80 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
          )}>
            {result.confidence}%
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Defect Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div>
            <div className="text-sm text-slate-500 mb-1">Identified Defect</div>
            <div className="text-xl font-bold text-slate-900">{result.defect}</div>
            <div className="text-sm font-mono text-slate-500 mt-1 flex items-center">
              <Book className="h-3 w-3 mr-1" />
              {result.code}
            </div>
          </div>
          <div className={clsx("px-4 py-3 rounded-lg border flex flex-col items-center min-w-[120px]", getKtsColor(result.kts))}>
            <span className="text-xs font-semibold opacity-70 mb-1">KTS Category</span>
            <span className="text-2xl font-black tracking-tight">{result.kts}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-400" />
                Description & Reasoning
              </h3>
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                <p className="text-slate-700 text-sm leading-relaxed">{result.description}</p>
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-2">EXPERT REASONING</span>
                  <p className="text-slate-600 text-sm italic bg-slate-50 p-3 rounded border border-slate-100">
                    "{result.reasoning}"
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                <Book className="h-4 w-4 mr-2 text-slate-400" />
                Normative Reference
              </h3>
              <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm shadow-sm">
                {result.normativeReference}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2 text-slate-400" />
                Measures & Priority
              </h3>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-sm font-medium text-slate-700">Required Action</span>
                  <span className={clsx(
                    "px-2 py-0.5 rounded text-xs font-bold uppercase",
                    result.priority.toLowerCase().includes('immediate') || result.priority.toLowerCase().includes('urgent') 
                      ? "bg-red-100 text-red-700" 
                      : "bg-blue-100 text-blue-700"
                  )}>
                    {result.priority}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-slate-700 text-sm">{result.measures}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-slate-400" />
                Repair Methods
              </h3>
              <div className="bg-engineering-50 p-4 rounded-lg border border-engineering-100">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{result.repairMethods}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
           <p className="text-xs text-slate-400">Analysis generated based on СН 1.04.01-2020 and СП 1.04.02-2022. Verification by a licensed engineer is recommended.</p>
        </div>
      </div>
    </div>
  );
};