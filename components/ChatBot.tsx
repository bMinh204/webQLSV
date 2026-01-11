
import { GoogleGenAI } from "@google/genai";
import { 
  Bot, 
  Loader2, 
  MessageSquare, 
  Minimize2, 
  Send, 
  User as UserIcon, 
  X 
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Chào ${user?.fullName}! Tôi là EduBot, trợ lý ảo của EduChain. Tôi có thể giúp gì cho bạn hôm nay?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiKey = process.env.API_KEY;

    if (!input.trim() || isLoading) return;

    // Kiểm tra API Key khi chạy local
    if (!apiKey) {
      console.error("EDU-CHAIN ERROR: API_KEY is missing in environment variables.");
      setMessages(prev => [...prev, 
        { role: 'user', text: input.trim() },
        { role: 'model', text: "Lỗi: Hệ thống chưa được cấu hình API Key. Nếu bạn đang chạy local, hãy kiểm tra biến môi trường process.env.API_KEY." }
      ]);
      setInput('');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Khởi tạo instance mới để đảm bảo lấy key mới nhất
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `Bạn là EduBot, một trợ lý AI thông minh và thân thiện của hệ thống EduChain. 
          Người dùng hiện tại: ${user?.fullName} (${user?.role}).
          Nhiệm vụ: Giải đáp thắc mắc học vụ, quy chế điểm số và hỗ trợ thao tác trên web. 
          Trả lời ngắn gọn, tiếng Việt chuyên nghiệp.`,
          temperature: 0.7,
        }
      });

      const botText = response.text;
      
      if (!botText) {
        throw new Error("Empty response from AI model");
      }

      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error: any) {
      console.error("EDU-CHAIN AI ERROR DETAILS:", error);
      
      let errorFriendlyMessage = "Hệ thống AI hiện đang bận. Vui lòng thử lại sau vài giây.";
      
      if (error?.message?.includes('403')) {
        errorFriendlyMessage = "Lỗi 403: Google Gemini chưa hỗ trợ vùng địa lý này hoặc Key bị chặn.";
      } else if (error?.message?.includes('401')) {
        errorFriendlyMessage = "Lỗi 401: API Key không hợp lệ hoặc đã hết hạn.";
      } else if (error?.message?.includes('429')) {
        errorFriendlyMessage = "Lỗi 429: Bạn đang gửi quá nhiều yêu cầu, vui lòng đợi một chút.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorFriendlyMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold leading-none">EduBot AI</h3>
                <p className="text-[10px] text-blue-100 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                    m.role === 'user' ? 'bg-white border-slate-200' : 'bg-blue-600 border-blue-600'
                  }`}>
                    {m.role === 'user' ? <UserIcon className="w-4 h-4 text-slate-500" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs font-medium text-slate-400">EduBot đang suy nghĩ...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-50">
            <div className="relative">
              <input 
                type="text"
                placeholder="Hỏi tôi về điểm số, lịch học..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {!isOpen && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-bold text-sm pl-2">
            Hỏi EduBot AI
          </span>
        )}
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;
