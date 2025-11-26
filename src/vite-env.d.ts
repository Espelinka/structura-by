// Fix for TS2591: Augment NodeJS.ProcessEnv instead of redeclaring process
// This avoids conflicts with @types/node or other declarations
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
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