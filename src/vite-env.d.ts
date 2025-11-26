// Исправление ошибки: удалена ссылка на отсутствующий vite/client
// /// <reference types="vite/client" />

// Исправление ошибки TS2591: Явно объявляем глобальную переменную process для среды браузера.
// Используем 'var' вместо 'const', чтобы избежать конфликтов переобъявления.
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: { mode: string | string[] };
  }

  interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(): void;
    then(callback: () => void): void;
  }

  // Функция html2pdf возвращает воркер и может быть вызвана напрямую
  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}
