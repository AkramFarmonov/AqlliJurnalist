import { GoogleGenAI } from "@google/genai";

// Using Gemini 1.5 Flash for AI-powered news platform
const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "default_key"
});

export interface GeneratedArticle {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
}

export async function generateArticle(topic: string, category: string = "Texnologiya"): Promise<GeneratedArticle> {
  try {
    const prompt = `O'zbek tilida "${topic}" mavzusida yangilik maqolasi yozing. Maqola zamonaviy, ma'lumotli va qiziqarli bo'lishi kerak. JSON formatida javob bering.`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: `Siz professional jurnalistsiz. O'zbek tilida yangilik maqolalari yozasiz. Javobni JSON formatida bering: {
          "title": "maqola sarlavhasi",
          "summary": "qisqa mazmun (150 so'zdan kam)",
          "content": "to'liq maqola matni (500+ so'z)",
          "category": "${category}",
          "tags": ["teglar", "ro'yxati"]
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          },
          required: ["title", "summary", "content", "category", "tags"],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      title: result.title || `${topic} haqida yangilik`,
      summary: result.summary || "Yangilik haqida qisqacha ma'lumot",
      content: result.content || "Maqola matni mavjud emas",
      category: result.category || category,
      tags: result.tags || [topic],
    };
  } catch (error) {
    console.error("Article generation failed:", error);
    throw new Error("Maqola yaratishda xatolik yuz berdi");
  }
}

export async function generateChatResponse(userMessage: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `Siz "Aqlli Jurnalist" platformasining AI yordamchisisiz. O'zbek tilida javob bering. Yangiliklar, trendlar va texnologiya haqida savollar berilganda yordam bering. Javobingiz qisqa va aniq bo'lsin.`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: systemPrompt + (context ? `\n\nKontekst: ${context}` : ""),
        maxOutputTokens: 300,
      },
      contents: userMessage,
    });

    return response.text || "Kechirasiz, javob berishda xatolik yuz berdi.";
  } catch (error) {
    console.error("Chat response generation failed:", error);
    return "Kechirasiz, hozirda javob bera olmayman. Iltimos, keyinroq urinib ko'ring.";
  }
}

export async function analyzeTrends(articles: any[]): Promise<{ topic: string; relevance: number }[]> {
  try {
    const articlesText = articles.map(a => `${a.title} ${a.summary}`).join("\n");
    
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: `Berilgan maqolalar asosida eng muhim trendlarni aniqlang. JSON formatida javob bering: {
          "trends": [
            {"topic": "trend nomi", "relevance": 1-100_orasida_ball}
          ]
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topic: { type: "string" },
                  relevance: { type: "number" }
                },
                required: ["topic", "relevance"]
              }
            }
          },
          required: ["trends"]
        },
      },
      contents: `Bu maqolalarni tahlil qiling:\n${articlesText}`,
    });

    const result = JSON.parse(response.text || '{"trends": []}');
    return result.trends || [];
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return [];
  }
}
