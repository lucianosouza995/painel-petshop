import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const analyzeConsultation = async (notes: string, serviceType: string) => {
  if (!apiKey) {
    console.warn("API Key missing, returning mock data.");
    return {
      riskScore: 50,
      sentiment: "Neutro",
      summary: "Chave de API ausente. Resumo simulado fornecido.",
      healthTrend: "stable"
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following veterinary consultation notes for a ${serviceType} visit. 
      Notes: "${notes}".
      
      Determine the risk score (0-100 where 100 is critical), the client/pet sentiment (Positive, Neutral, Negative), a brief summary for the timeline in Portuguese (Brazil), and the health trend (improving, stable, declining).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "Risk score from 0 to 100" },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
            summary: { type: Type.STRING, description: "One sentence summary of the visit in Portuguese" },
            healthTrend: { type: Type.STRING, enum: ["improving", "stable", "declining"] }
          },
          required: ["riskScore", "sentiment", "summary", "healthTrend"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      riskScore: 0,
      sentiment: "Neutro",
      summary: "Falha na análise.",
      healthTrend: "stable"
    };
  }
};
