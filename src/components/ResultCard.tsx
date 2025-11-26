import { FC } from 'react';
import { ShieldAlert, Wrench, Activity, AlertTriangle, FileText, Scale, ClipboardCheck, AlertOctagon } from 'lucide-react';
import { AnalysisResult } from '../types';
import clsx from 'clsx';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: FC<ResultCardProps> = ({ result }) => {
  const getKtsColor = (kts: string) => {
    const ktsUpper = kts.toUpperCase();
    if (ktsUpper.includes('I') && !ktsUpper.includes('III') && !ktsUpper.includes('V')) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (ktsUpper.includes('II')) return 'bg-blue-50 text-blue-900 border-blue-200';
    if (ktsUpper.includes('III')) return 'bg-yellow-50 text-yellow-900 border-yellow-200';
    if (ktsUpper.includes('IV')) return 'bg-orange-50 text-orange-900 border-orange-200';
    if (ktsUpper.includes('V')) return 'bg-red-50 text-red-900 border-red-200';
    return 'bg-slate-50 text-slate-900 border-slate-200';
  };

  const SectionHeader = ({ number, title, icon: Icon }: { number: string; title: string; icon: any }) => (
    <h3 className="text-base font-semibold text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2 flex items-center">
      <span className="bg-slate-100 text-slate-600 rounded-md w-7 h-7 flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
        {number}
      </span>
      <span className="flex-grow">{title}</span>
      <Icon className="h-4 w-4 text-slate-400" />
    </h3>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-black" id="analysis-report">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Техническое Заключение</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Экспертиза на соответствие СН 1.04.01-2020 и СП 1.04.02-2022
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Достоверность AI</span>
            <div className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm backdrop-blur-sm",
              result.confidence > 80 
                ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30" 
                : "bg-yellow-500/20 text-yellow-100 border-yellow-500/30"
            )}>
              {result.confidence}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        
        {/* 1. Код дефекта */}
        <section>
          <SectionHeader number="1" title="Определённый дефект и код" icon={AlertOctagon} />
          <div className="bg-white p-0">
            <div className="text-xl font-bold text-slate-900 mb-3">{result.defect}</div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-sm font-medium">
              {result.code}
            </div>
          </div>
        </section>

        {/* 2. Краткое описание */}
        <section>
          <SectionHeader number="2" title="Краткое описание дефекта" icon={FileText} />
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm bg-slate-50/50 p-6 rounded-xl border border-slate-100">
            <p className="whitespace-pre-line">{result.description}</p>
          </div>
        </section>

        {/* 3. Нормативное обоснование */}
        <section>
          <SectionHeader number="3" title="Нормативное обоснование" icon={Scale} />
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/60 relative">
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-400 rounded-r-full"></div>
            <div className="text-slate-700 text-sm italic pl-2 leading-relaxed whitespace-pre-line">
              {result.normativeReference}
            </div>
          </div>
        </section>

        {/* 4. Категория технического состояния (КТС) */}
        <section>
          <SectionHeader number="4" title="Категория технического состояния (КТС)" icon={Activity} />
          <div className={clsx("p-6 rounded-xl border shadow-sm transition-all", getKtsColor(result.kts))}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/40 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 opacity-90" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 tracking-tight">{result.kts.split('\n')[0]}</h4>
                <p className="text-sm font-medium opacity-80 whitespace-pre-line leading-relaxed">
                  {result.kts.split('\n').slice(1).join('\n')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Рекомендуемые мероприятия */}
        <section>
          <SectionHeader number="5" title="Рекомендуемые мероприятия" icon={ClipboardCheck} />
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
              {result.measures}
            </div>
          </div>
        </section>

        {/* 6. Приоритет */}
        <section>
          <SectionHeader number="6" title="Приоритет / Срочность" icon={ShieldAlert} />
          <div className="flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className={clsx(
              "p-3 rounded-lg mr-5 flex-shrink-0",
              result.priority.toLowerCase().includes('высокая') || result.priority.toLowerCase().includes('аварий') 
                ? "bg-red-50 text-red-600" 
                : "bg-blue-50 text-blue-600"
            )}>
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 mb-1">
                {result.priority}
              </div>
              <div className="text-xs text-slate-500">
                Оценка срочности выполнения ремонтных работ
              </div>
            </div>
          </div>
        </section>

        {/* 7. Методы устранения */}
        <section>
          <SectionHeader number="7" title="Методы устранения дефектов" icon={Wrench} />
          <div className="bg-slate-900 text-slate-300 p-8 rounded-xl shadow-inner">
            <div className="flex items-start gap-4">
              <Wrench className="h-5 w-5 mt-1 text-blue-400" />
              <div className="text-sm leading-relaxed whitespace-pre-line font-light">
                {result.repairMethods}
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            Автоматически сгенерированный отчет • Structura.BY AI
          </p>
        </div>
      </div>
    </div>
  );
};