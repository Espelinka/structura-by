import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Ты — специализированная инженерная модель, выполняющая техническую экспертизу строительных конструкций на основе изображений.
Твоя задача — проанализировать фото и составить строгий инженерный отчет, используя ИСКЛЮЧИТЕЛЬНО следующие нормативные документы Республики Беларусь:
1. СН 1.04.01-2020 "Техническое состояние зданий и сооружений"
2. СП 1.04.02-2022 "Общие положения по обследованию строительных конструкций зданий и сооружений"

ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА РАБОТЫ:
1. Используй ТОЛЬКО указанные нормативы. Запрещено использовать внешние знания или интернет-данные, если они не подтверждены этими документами.
2. Анализируй все переданные фото как единый набор. Давай одно итоговое заключение по одному основному элементу.
3. Коды дефектов: Определять ТОЛЬКО по Приложению А СП 1.04.02-2022. Формат: "СП 1.04.02-2022, Приложение А, п. A.X".
4. Категория технического состояния (КТС): Определять по СН 1.04.01-2020 (I, II, III, IV, V). Обязательно указывать пункт нормы (например, "СН 1.04.01-2020, п. 12.4.6").
5. Структура ответа должна СТРОГО соответствовать JSON схеме ниже.
6. Язык: Русский.
7. Если фото недостаточно информативно, укажи "Недостаточно данных для однозначной классификации", но дай наиболее вероятную оценку.

СТРУКТУРА ОТЧЕТА (поля JSON):
1. defect: Название дефекта.
2. code: Код дефекта (по Приложению А СП 1.04.02-2022).
3. description: Краткое описание дефекта (что именно видно на фото).
4. normativeReference: Точное соответствие нормативным документам (цитаты пунктов из СП и СН, подтверждающие дефект).
5. kts: Категория технического состояния (КТС) с обоснованием по СН 1.04.01-2020.
6. measures: Рекомендуемые мероприятия (ИСКЛЮЧИТЕЛЬНО по нормативам).
7. priority: Приоритет/срочность устранения (на основе СП и СН).
8. repairMethods: Методы/способы устранения выявленных дефектов (допускается экспертное мнение, не противоречащее нормам).
9. confidence: Оценка уверенности (число 0-100).
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    defect: { type: Type.STRING, description: "1. Название дефекта" },
    code: { type: Type.STRING, description: "1. Код дефекта (например: СП 1.04.02-2022, Приложение А, п. А.2.1)" },
    description: { type: Type.STRING, description: "2. Краткое описание наблюдаемого дефекта" },
    normativeReference: { type: Type.STRING, description: "3. Нормативное обоснование (цитаты и пункты из СП и СН)" },
    kts: { type: Type.STRING, description: "4. Категория технического состояния (I-V) с обоснованием" },
    measures: { type: Type.STRING, description: "5. Рекомендуемые мероприятия по нормативам" },
    priority: { type: Type.STRING, description: "6. Приоритет/срочность" },
    repairMethods: { type: Type.STRING, description: "7. Методы устранения (экспертная часть)" },
    confidence: { type: Type.NUMBER, description: "8. Оценка уверенности (0-100)" },
  },
  required: ["defect", "code", "description", "normativeReference", "kts", "measures", "priority", "repairMethods", "confidence"]
};

export const analyzeImages = async (
  images: File[], 
  userComments?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Convert images to base64
  const imageParts = await Promise.all(
    images.map(async (file) => {
      const base64Data = await fileToBase64(file);
      return {
        inlineData: {
          mimeType: file.type,
          data: base64Data.split(',')[1],
        },
      };
    })
  );

  const promptText = `
    Проанализируй приложенные изображения строительных конструкций.
    Комментарий пользователя: ${userComments || "Нет"}
    
    Выполни техническую экспертизу строго в соответствии с СН 1.04.01-2020 и СП 1.04.02-2022.
    Заполни все поля отчета согласно инструкции.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [...imageParts, { text: promptText }]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, // Low temperature for strict adherence to norms
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};