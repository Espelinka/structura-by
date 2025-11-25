import { FC } from 'react';
import { ShieldAlert, Wrench, Activity, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import clsx from 'clsx';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: FC<ResultCardProps> = ({ result }) => {
  const getKtsColor = (kts: string) => {
    const ktsUpper = kts.toUpperCase();
    if (ktsUpper.includes('I') && !ktsUpper.includes('III') && !ktsUpper.includes('V')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (ktsUpper.includes('II')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (ktsUpper.includes('III')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (ktsUpper.includes('IV')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (ktsUpper.includes('V')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none" id="analysis-report">
      {/* Report Header */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-engineering-600" />
            Техническое Заключение
          </h2>
          <p className="text-sm text-slate-500 mt-1">На основании СН 1.04.01-2020 и СП 1.04.02-2022</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Достоверность</span>
          <div className={clsx(
            "px-3 py-1 rounded-full text-sm font-bold border",
            result.confidence > 80 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
          )}>
            {result.confidence}%
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* 1. Код дефекта */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
            <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
            Определённый дефект и код
          </h3>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="text-lg font-semibold text-slate-900 mb-2">{result.defect}</div>
            <div className="font-mono text-sm text-engineering-700 bg-engineering-50 inline-block px-3 py-1 rounded border border-engineering-100">
              {result.code}
            </div>
          </div>
        </section>

        {/* 2. Краткое описание */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
            <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
            Краткое описание дефекта
          </h3>
          <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
            {result.description}
          </p>
        </section>

        {/* 3. Нормативное обоснование */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
            <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
            Нормативное обоснование
          </h3>
          <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-slate-400 italic text-slate-700 text-sm">
            {result.normativeReference}
          </div>
        </section>

        {/* 4. Категория технического состояния (КТС) */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
            <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
            Категория технического состояния (КТС)
          </h3>
          <div className={clsx("p-6 rounded-lg border-2", getKtsColor(result.kts))}>
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-bold mb-2">{result.kts.split('\n')[0]}</h4>
                <p className="text-sm opacity-90 whitespace-pre-line">{result.kts.split('\n').slice(1).join('\n')}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 5. Рекомендуемые мероприятия */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
              <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">5</span>
              Рекомендуемые мероприятия
            </h3>
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {result.measures}
            </div>
          </section>

          {/* 6. Приоритет */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
              <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">6</span>
              Приоритет / Срочность
            </h3>
            <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center">
              <ShieldAlert className={clsx(
                "h-8 w-8 mr-4",
                result.priority.toLowerCase().includes('высокая') || result.priority.toLowerCase().includes('аварий') 
                  ? "text-red-500" 
                  : "text-blue-500"
              )} />
              <div className="text-lg font-medium text-slate-900">
                {result.priority}
              </div>
            </div>
          </section>
        </div>

        {/* 7. Методы устранения */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b pb-2 flex items-center">
            <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">7</span>
            Методы устранения дефектов
          </h3>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-start">
              <Wrench className="h-5 w-5 mr-3 text-slate-400 mt-0.5" />
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {result.repairMethods}
              </p>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>Автоматически сгенерированный отчет. Требует верификации аттестованным специалистом.</p>
        </div>
      </div>
    </div>
  );
};