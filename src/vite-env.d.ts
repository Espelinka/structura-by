/// <reference types="vite/client" />

// Fix for TS2591: Explicitly declare process as a global variable for browser environment
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    // Changed from tuple to number[] | number to accept standard arrays and avoid TS2345
    margin?: number | number[]; 
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: any;
    jsPDF?: any;
  }

  interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(): void;
    then(callback: () => void): void;
  }

  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}