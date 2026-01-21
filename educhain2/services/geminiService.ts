import { GoogleGenAI } from "@google/genai";
import { StudentTranscript } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatbotResponse = async (userMessage: string, context?: string): Promise<string> => {
  try {
    const systemInstruction = `Bạn là một trợ lý học vụ hữu ích cho một trường đại học.
    Bạn giúp sinh viên và giảng viên trả lời các câu hỏi về điểm số, quy định và lịch trình.
    Hãy trả lời ngắn gọn, chuyên nghiệp, thân thiện và LUÔN LUÔN sử dụng TIẾNG VIỆT.
    ${context ? `Dưới đây là ngữ cảnh về người dùng hiện tại: ${context}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Xin lỗi, tôi không thể tạo phản hồi vào lúc này.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Hiện tại tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.";
  }
};

export const analyzeStudentPerformance = async (transcript: StudentTranscript[]): Promise<string> => {
  try {
    const transcriptString = JSON.stringify(transcript);
    const prompt = `
      Phân tích dữ liệu bảng điểm sinh viên sau đây:
      ${transcriptString}

      1. Xác định các môn học mà sinh viên đang trượt hoặc có nguy cơ (Cảnh báo/Trượt).
      2. Đưa ra lời khuyên cụ thể, thực tế để cải thiện trong các lĩnh vực đó.
      3. Dự đoán khả năng qua môn/hoàn thành học kỳ nếu xu hướng này tiếp tục.
      4. Giữ giọng điệu xây dựng và hỗ trợ.
      5. Định dạng phản hồi bằng Markdown và sử dụng TIẾNG VIỆT.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    return response.text || "Không thể tạo phân tích.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Không thể thực hiện phân tích AI vào lúc này.";
  }
};