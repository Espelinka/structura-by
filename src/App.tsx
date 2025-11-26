import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ResultCard } from './components/ResultCard';
import { ImageFile, AnalysisResult } from './types';
import { analyzeImages } from './services/geminiService';
import { Loader2, AlertCircle, Download, Send, Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [comments, setComments] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const files = images.map(img => img.file);
      const data = await analyzeImages(files, comments);
      setResult(data);
    } catch (err) {
      setError("Не удалось выполнить анализ. Пожалуйста, проверьте API ключ или попробуйте позже.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setResult(null);
    setComments('');
    setError(null);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('analysis-report');
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `structura_by_report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    if (typeof html2pdf === 'function') {
      html2pdf().set(opt).from(element).save();
    } else {
      alert("Ошибка генерации PDF: Библиотека не загружена.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Исходные данные</h2>
                {images.length > 0 && (
                  <button 
                    onClick={handleReset}
                    className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center transition-colors px-2 py-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Сброс
                  </button>
                )}
              </div>
              
              <ImageUpload 
                images={images} 
                onImagesChange={setImages} 
                disabled={isAnalyzing} 
              />

              <div className="mt-8">
                <label htmlFor="comments" className="block text-sm font-semibold text-slate-700 mb-3">
                  Комментарий эксперта (Опционально)
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-4 transition-shadow duration-200 outline-none focus:ring-2"
                  placeholder="Укажите локацию, условия эксплуатации или замеченные особенности..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={images.length === 0 || isAnalyzing}
                className={`w-full mt-8 flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white transition-all duration-200
                  ${images.length === 0 || isAnalyzing 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Анализ нормативной базы...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Анализировать дефект
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Отчет об обследовании</h2>
              {result && (
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 transition-colors duration-200"
                >
                  <Download className="-ml-1 mr-2 h-4 w-4" />
                  Скачать PDF
                </button>
              )}
            </div>

            {result ? (
              <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ResultCard result={result} />
              </div>
            ) : (
              <div className="h-[600px] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 shadow-sm">
                {isAnalyzing ? (
                  <div className="text-center p-8">
                    <div className="relative mx-auto mb-6">
                      <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">Генерация экспертного заключения</p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Система анализирует дефекты на соответствие СН 1.04.01-2020 и СП 1.04.02-2022</p>
                  </div>
                ) : (
                  <div className="text-center p-8 opacity-60">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 mx-auto border border-slate-100">
                      <div className="h-10 w-10 border-t-2 border-r-2 border-slate-300 rounded-tr-xl" />
                    </div>
                    <p className="text-lg font-medium text-slate-900">Ожидание данных</p>
                    <p className="text-sm text-slate-500 mt-1">Загрузите фото для начала работы</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Structura.BY. Все права защищены.
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-600">
            <span>По вопросам сотрудничества</span>
            <a 
              href="https://t.me/Espelinka" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              @Espelinka
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;