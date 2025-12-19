
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Flashcard, QuizQuestion, AIMode, RelatedTopic } from '../types';

// Always use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SmartPromptResponse {
  content: string;
  groundingSources: { title: string; uri: string }[];
}

export interface AnalyzedContentAction {
    type: 'PROBLEM' | 'CONTENT' | 'OTHER';
    summary: string;
    suggestions: {
        title: string;
        description: string;
        promptTemplate: string; // Contains extracted text pre-filled
        icon: string;
    }[];
}

// Helper to get model config based on mode
const getModelConfig = (mode: AIMode) => {
  if (mode === 'THINKING') {
    return {
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 2048 } // Allocate budget for reasoning
      }
    };
  }
  // Default to Fast mode
  return {
    model: 'gemini-flash-lite-latest', // High speed, low latency
    config: {}
  };
};

// Helper to clean JSON string from Markdown fences
const cleanJsonString = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateSmartPrompt = async (userInput: string): Promise<SmartPromptResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: `Người dùng muốn thực hiện nhiệm vụ: "${userInput}".
      Hãy viết lại yêu cầu này thành một "Prompt" (câu lệnh) chuyên nghiệp, chi tiết và hiệu quả để gửi cho AI.
      Sử dụng cấu trúc:
      1. Vai trò (Role): AI đóng vai ai?
      2. Bối cảnh (Context): Thông tin nền.
      3. Nhiệm vụ (Task): Cụ thể cần làm gì.
      4. Định dạng (Format): Kết quả trả về như thế nào.
      
      Chỉ trả về nội dung của Prompt đã tối ưu, bằng tiếng Việt.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "Không thể tạo prompt.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return { content: text, groundingSources: sources };
  } catch (error) {
    console.error("Lỗi khi tạo smart prompt:", error);
    throw error;
  }
};

export const runGeminiPrompt = async (promptContent: string, mode: AIMode = 'FAST'): Promise<string> => {
  try {
    const { model, config } = getModelConfig(mode);
    const response = await ai.models.generateContent({
      model: model,
      contents: promptContent,
      config: config
    });
    return response.text || "AI không trả về kết quả nào.";
  } catch (error) {
    console.error("Lỗi khi chạy prompt:", error);
    return "Đã xảy ra lỗi khi thực thi prompt này. Vui lòng thử lại sau.";
  }
};

export const generatePromptImage = async (promptDescription: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `A high-contrast minimalist black and white vector illustration for educational concept: ${promptDescription}. Professional clean lines.`
        }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Lỗi tạo ảnh prompt:", error);
    return null;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'application/octet-stream';
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: "Hãy trích xuất toàn bộ văn bản và nội dung chính của tệp này (kể cả tệp Word, PDF hay PowerPoint). Trình bày mạch lạc, giữ nguyên cấu trúc các đề mục chính." }
        ]
      }
    });
    return response.text || "Không tìm thấy nội dung văn bản.";
  } catch (error) {
    console.error("Lỗi trích xuất file:", error);
    throw new Error("Không thể xử lý định dạng này. Vui lòng thử PDF hoặc tệp văn bản chuẩn.");
  }
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  try {
    const base64Data = base64Image.split(',')[1] || base64Image;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Hãy trích xuất toàn bộ văn bản có trong hình ảnh này. Giữ nguyên định dạng, công thức toán học." }
        ]
      }
    });
    return response.text || "Không tìm thấy văn bản.";
  } catch (error) {
    console.error("Lỗi OCR:", error);
    throw error;
  }
};

export const analyzeExtractedContent = async (text: string): Promise<AnalyzedContentAction | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Phân tích văn bản sau và đề xuất hành động.
            Văn bản: "${text.substring(0, 2000)}..." (đã cắt bớt)

            Yêu cầu:
            1. Xác định loại nội dung: 'PROBLEM' (Bài tập/Đề thi/Câu hỏi) hay 'CONTENT' (Tài liệu/Lý thuyết/Văn bản thường).
            2. Tóm tắt nội dung trong 1 câu ngắn.
            3. Đề xuất 2 prompt mẫu để xử lý văn bản này.
               - Nếu là PROBLEM: Gợi ý giải từng bước, gợi ý đáp án nhanh.
               - Nếu là CONTENT: Gợi ý giải thích chuyên sâu, gợi ý tóm tắt ý chính.
               - PromptTemplate phải chứa nội dung văn bản gốc đã được chèn vào vị trí thích hợp.

            Trả về JSON format:
            {
                "type": "PROBLEM" | "CONTENT",
                "summary": "...",
                "suggestions": [
                    { "title": "...", "description": "...", "promptTemplate": "...", "icon": "calculator|book|sparkles" }
                ]
            }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ["PROBLEM", "CONTENT", "OTHER"] },
                        summary: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    promptTemplate: { type: Type.STRING },
                                    icon: { type: Type.STRING }
                                },
                                required: ["title", "description", "promptTemplate", "icon"]
                            }
                        }
                    },
                    required: ["type", "summary", "suggestions"]
                }
            }
        });

        const result = JSON.parse(cleanJsonString(response.text || "{}"));
        
        // Post-process to ensure extracted text is fully embedded if AI truncated it or used placeholder
        const processedSuggestions = result.suggestions.map((s: any) => ({
            ...s,
            promptTemplate: s.promptTemplate.includes(text.substring(0, 50)) ? s.promptTemplate : `${s.promptTemplate}\n\nNội dung văn bản:\n${text}`
        }));

        return { ...result, suggestions: processedSuggestions };
    } catch (error) {
        console.error("Lỗi phân tích nội dung:", error);
        return null;
    }
};

export const generateSummary = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tóm tắt nội dung sau đây một cách chuyên nghiệp và súc tích bằng tiếng Việt. Nếu có định nghĩa quan trọng hãy bôi đậm:\n\n${text}`,
    });
    return response.text || "Không thể tóm tắt.";
  } catch (error) {
    throw error;
  }
};

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo 5-8 flashcard từ nội dung này. Mặt trước là thuật ngữ/câu hỏi ngắn. Mặt sau là định nghĩa/câu trả lời súc tích.
      Nội dung: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ['front', 'back']
          }
        }
      }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
  } catch (error) {
    console.error("Error parsing flashcards:", error);
    return [];
  }
};

export const generateQuiz = async (text: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo 5 câu hỏi trắc nghiệm khách quan từ nội dung này. Câu hỏi phải bao quát ý chính.
      Nội dung: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING, description: "Giải thích ngắn gọn tại sao đáp án này đúng." }
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation']
          }
        }
      }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
  } catch (error) {
    console.error("Error parsing quiz:", error);
    return [];
  }
};

export const generateRelatedTopics = async (text: string): Promise<RelatedTopic[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Từ nội dung này, hãy đề xuất 4-5 chủ đề nâng cao hoặc liên quan để người học mở rộng kiến thức.
      Nội dung gốc: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING, description: "Mô tả ngắn về chủ đề này và nội dung sẽ học." },
              relevance: { type: Type.STRING, description: "Tại sao chủ đề này liên quan?" }
            },
            required: ['title', 'description', 'relevance']
          }
        }
      }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
  } catch (error) {
    console.error("Lỗi tạo chủ đề mở rộng:", error);
    return [];
  }
};

let chatSession: Chat | null = null;
let currentChatModel: string = '';

export const getChatSession = (mode: AIMode = 'FAST') => {
  const { model, config } = getModelConfig(mode);
  
  if (!chatSession || currentChatModel !== model) {
    currentChatModel = model;
    chatSession = ai.chats.create({
      model: model,
      config: {
        ...config,
        systemInstruction: 'Bạn là trợ lý giáo dục AI cao cấp. Hãy trả lời chuyên nghiệp, súc tích bằng tiếng Việt.',
      }
    });
  }
  return chatSession;
};

export const createStudyChatSession = (context: string, mode: AIMode = 'FAST') => {
  const { model, config } = getModelConfig(mode);
  return ai.chats.create({
    model: model,
    config: {
      ...config,
      systemInstruction: `Bạn là YouLearn AI. Hãy trả lời dựa trên văn bản này: ${context}.`,
    }
  });
};

export const sendChatMessage = async (message: string, mode: AIMode = 'FAST'): Promise<string> => {
  try {
    const session = getChatSession(mode);
    const response = await session.sendMessage({ message });
    return response.text || "Lỗi phản hồi.";
  } catch (error) {
    return "Lỗi kết nối hoặc mô hình đang bận.";
  }
};
