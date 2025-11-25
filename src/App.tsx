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
      margin: 10,
      filename: `tech_expert_report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf === 'function') {
      html2pdf().set(opt).from(element).save();
    } else {
      console.error("html2pdf library not loaded correctly", html2pdf);
      alert("Ошибка генерации PDF: Библиотека не загружена.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">1. Исходные данные</h2>
                {images.length > 0 && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center transition-colors"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Сброс
                  </button>
                )}
              </div>
              
              <ImageUpload 
                images={images} 
                onImagesChange={setImages} 
                disabled={isAnalyzing} 
              />

              <div className="mt-6">
                <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-2">
                  Комментарий эксперта (Опционально)
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-engineering-500 focus:ring-engineering-500 sm:text-sm p-3 border bg-slate-50"
                  placeholder="Например: Стена на 2-м этаже, северная сторона. Трещины появились после зимы."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={images.length === 0 || isAnalyzing}
                className={`w-full mt-6 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
                  ${images.length === 0 || isAnalyzing 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-engineering-600 hover:bg-engineering-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engineering-500'
                  }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Анализ через Gemini AI...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Запустить Техническую Экспертизу
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">2. Отчет об обследовании</h2>
              {result && (
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engineering-500"
                >
                  <Download className="-ml-1 mr-2 h-4 w-4" />
                  Скачать PDF
                </button>
              )}
            </div>

            {result ? (
              <div ref={resultRef}>
                <ResultCard result={result} />
              </div>
            ) : (
              <div className="h-[500px] bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                {isAnalyzing ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-engineering-500" />
                    <p className="text-lg font-medium text-slate-600">Обработка нормативной базы...</p>
                    <p className="text-sm">Сверка с СН 1.04.01-2020 и СП 1.04.02-2022</p>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <div className="h-8 w-8 border-t-2 border-r-2 border-slate-400 rounded-tr-lg" />
                    </div>
                    <p>Загрузите фото для генерации экспертного заключения</p>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;