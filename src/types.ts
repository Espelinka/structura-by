export interface AnalysisResult {
  defect: string;
  code: string;
  description: string;
  normativeReference: string;
  kts: string;
  measures: string;
  priority: string;
  repairMethods: string;
  confidence: number;
  reasoning: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}

export enum KTS {
  I = "I",
  II = "II",
  III = "III",
  IV = "IV",
  V = "V"
}