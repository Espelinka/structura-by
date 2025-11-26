import { FC } from 'react';
import { HardHat, BookOpen } from 'lucide-react';

export const Header: FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
            <HardHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">Structura.BY</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Инженерная Экспертиза</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <BookOpen className="h-3.5 w-3.5 mr-2" />
            <span>База: СН 1.04.01-2020 / СП 1.04.02-2022</span>
          </div>
        </div>
      </div>
    </header>
  );
};