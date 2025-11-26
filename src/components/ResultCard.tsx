import { FC } from 'react';
import { ShieldAlert, Wrench, Activity, AlertTriangle, FileText, Scale, ClipboardCheck, AlertOctagon } from 'lucide-react';
import { AnalysisResult } from '../types';
import clsx from 'clsx';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: FC<ResultCardProps> = ({ result }) => {
  // Helper to get accent colors based on KTS, but NOT for the whole background/text
  const getKtsAccent = (kts: string) => {
    const ktsUpper = kts.toUpperCase();
    if (ktsUpper.includes('I') && !ktsUpper.includes('III') && !ktsUpper.includes('V')) return { border: 'border-emerald-500', icon: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (ktsUpper.includes('II')) return { border: 'border-blue-500', icon: 'text-blue-600', bg: 'bg-blue-50' };
    if (ktsUpper.includes('III')) return { border: 'border-yellow-500', icon: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (ktsUpper.includes('IV')) return { border: 'border-orange-500', icon: 'text-orange-600', bg: 'bg-orange-50' };
    if (ktsUpper.includes('V')) return { border: 'border-red-500', icon: 'text-red-600', bg: 'bg-red-50' };
    return { border: 'border-slate-300', icon: 'text-slate-500', bg: 'bg-slate-50' };
  };

  const ktsStyle = getKtsAccent(result.kts);

  const SectionHeader = ({ number, title, icon: Icon }: { number: string; title: string; icon: any }) => (
    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
      <span className="bg-slate-200 text-slate-700 rounded flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
        {number}
      </span>
      <span className="flex-grow">{title}</span>
      <Icon className="h-4 w-4 text-slate-400 ml-2" />
    </h3>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border-black" id="analysis-report">
      {/* Report Header */}
      <div className="bg-slate-900 px-8 py-6 text-white border-b border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Activity className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold tracking-wide">Техническое Заключение</h2>
            </div>
            <p className="text-slate-400 text-xs font-medium ml-8">
              Экспертиза на соответствие СН 1.04.01-2020 и СП 1.04.02-2022
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Достоверность</span>
            <div className={clsx(
              "px-3 py-1 rounded-md text-xs font-bold border",
              result.confidence > 80 
                ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30" 
                : "bg-yellow-500/20 text-yellow-100 border-yellow-500/30"
            )}>
              {result.confidence}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* 1. Код дефекта */}
        <section>
          <SectionHeader number="1" title="Определённый дефект и код" icon={AlertOctagon} />
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="text-lg font-bold text-slate-900 mb-2">{result.defect}</div>
            <div className="inline-block bg-white px-3 py-1 rounded border border-slate-300 text-slate-700 font-mono text-sm font-semibold shadow-sm">
              {result.code}
            </div>
          </div>
        </section>

        {/* 2. Краткое описание */}
        <section>
          <SectionHeader number="2" title="Краткое описание дефекта" icon={FileText} />
          <div className="bg-white p-0">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {result.description}
            </p>
          </div>
        </section>

        {/* 3. Нормативное обоснование - ИТАЛИК ЗДЕСЬ */}
        <section>
          <SectionHeader number="3" title="Нормативное обоснование" icon={Scale} />
          <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-slate-300">
            <p className="text-slate-700 text-sm italic leading-relaxed whitespace-pre-line">
              {result.normativeReference}
            </p>
          </div>
        </section>

        {/* 4. Категория технического состояния (КТС) - УНИФИЦИРОВАННЫЙ СТИЛЬ */}
        <section>
          <SectionHeader number="4" title="Категория технического состояния (КТС)" icon={Activity} />
          <div className={clsx(
            "p-5 rounded-lg border border-slate-200 bg-white shadow-sm border-l-4",
            ktsStyle.border
          )}>
            <div className="flex items-start gap-4">
              <div className={clsx("p-2 rounded-full flex-shrink-0", ktsStyle.bg)}>
                <AlertTriangle className={clsx("h-5 w-5", ktsStyle.icon)} />
              </div>
              <div>
                {/* First line (The Category itself) is bold */}
                <h4 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
                  {result.kts.split('\n')[0]}
                </h4>
                {/* Rest of the text is standard slate-700 */}
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {result.kts.split('\n').slice(1).join('\n')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Рекомендуемые мероприятия */}
        <section>
          <SectionHeader number="5" title="Рекомендуемые мероприятия" icon={ClipboardCheck} />
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {result.measures}
            </div>
          </div>
        </section>

        {/* 6. Приоритет */}
        <section>
          <SectionHeader number="6" title="Приоритет / Срочность" icon={ShieldAlert} />
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center">
            <div className={clsx(
              "p-2 rounded-lg mr-4 flex-shrink-0",
              result.priority.toLowerCase().includes('высокая') || result.priority.toLowerCase().includes('аварий') 
                ? "bg-red-50 text-red-600" 
                : "bg-blue-50 text-blue-600"
            )}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                {result.priority}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Методы устранения - ИСПРАВЛЕНО: Светлый фон */}
        <section>
          <SectionHeader number="7" title="Методы устранения дефектов" icon={Wrench} />
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 mt-0.5 text-slate-400 flex-shrink-0" />
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
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
