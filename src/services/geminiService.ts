import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are a specialized Senior Structural Engineer acting as a Technical Expert for building analysis in the Republic of Belarus.
Your task is to analyze images of building structures and identify defects strictly according to two specific normative documents:
1. СН 1.04.01-2020 "Техническое состояние зданий и сооружений" (Technical condition of buildings and structures)
2. СП 1.04.02-2022 "Общие положения по обследованию строительных конструкций зданий и сооружений" (General provisions for the inspection of building structures)

MANDATORY RULES:
1. Use ONLY the provided norms. Do not use external internet data or general construction knowledge if it contradicts these docs.
2. Analyze all images as a single set. Provide one consolidated conclusion for the primary element shown.
3. Defect Codes: Determine codes ONLY from Appendix A (Приложение А) of СП 1.04.02-2022. Format: "СП 1.04.02-2022, Приложение А, п. A.X".
4. Technical Condition Category (KTS): Determine KTS (I, II, III, IV, V) using criteria from СН 1.04.01-2020. Cite the specific clause (e.g., "СН 1.04.01-2020, п. 12.4.6").
   - I: Good (Исправное)
   - II: Satisfactory (Работоспособное)
   - III: Limited Workable (Ограниченно работоспособное)
   - IV: Unsatisfactory/Pre-emergency (Неработоспособное)
   - V: Emergency (Предельное)
5. Structure your response strictly as a JSON object.
6. Language: Russian (as the norms are in Russian).
7. If data is insufficient, state "Недостаточно данных" but provide the most probable estimation based on visible signs.

OUTPUT JSON STRUCTURE:
{
  "defect": "Short name of defect",
  "code": "Code from Appx A of СП",
  "description": "Technical description based on visual evidence",
  "normativeReference": "Exact clause from norms",
  "kts": "Category (I-V)",
  "measures": "Required actions per norms (e.g., urgent propping, repair)",
  "priority": "Urgency (Immediate/Planned)",
  "repairMethods": "Technical method for elimination",
  "confidence": "Number 0-100",
  "reasoning": "Brief logic for the decision"
}
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    defect: { type: Type.STRING, description: "Name of the defect" },
    code: { type: Type.STRING, description: "Code from Appendix A of СП 1.04.02-2022" },
    description: { type: Type.STRING, description: "Visual description" },
    normativeReference: { type: Type.STRING, description: "Reference to clauses in СН or СП" },
    kts: { type: Type.STRING, description: "Technical Condition Category (I-V)" },
    measures: { type: Type.STRING, description: "Recommended measures per norms" },
    priority: { type: Type.STRING, description: "Urgency of repair" },
    repairMethods: { type: Type.STRING, description: "Suggested repair methods" },
    confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
    reasoning: { type: Type.STRING, description: "Explanation of the classification" },
  },
  required: ["defect", "code", "description", "normativeReference", "kts", "measures", "priority", "repairMethods", "confidence", "reasoning"]
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
    Analyze the attached images of building structures.
    User Comments: ${userComments || "None"}
    
    Perform a technical expertise based strictly on СН 1.04.01-2020 and СП 1.04.02-2022.
    Identify the defect, assign the code from Appendix A of СП, determine the KTS based on СН, and recommend measures.
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
        temperature: 0.2, // Low temperature for more deterministic/technical results
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
