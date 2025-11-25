export interface AnalysisResult {
  defect: string;          // 1. Определённый дефект
  code: string;            // 1. Код дефекта (по Приложению А СП 1.04.02-2022)
  description: string;     // 2. Краткое описание дефекта
  normativeReference: string; // 3. Точное соответствие нормативным документам
  kts: string;             // 4. Категория технического состояния (КТС)
  measures: string;        // 5. Рекомендуемые мероприятия (только по нормативам)
  priority: string;        // 6. Приоритет/срочность устранения
  repairMethods: string;   // 7. Методы/способы устранения (экспертная часть)
  confidence: number;      // 8. Оценка уверенности (%)
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