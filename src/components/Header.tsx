import { FC } from 'react';
import { HardHat, BookOpen } from 'lucide-react';

export const Header: FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HardHat className="h-8 w-8 text-engineering-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Structura.BY</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Expert Defect Analysis System (СН 1.04.01-2020 / СП 1.04.02-2022)</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <BookOpen className="h-3 w-3 mr-2" />
            <span>Normative Compliance Mode: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};