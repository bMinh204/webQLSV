
import { GoogleGenerativeAI } from "@google/generative-ai";
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
import { GEMINI_API_KEY, GEMINI_API_KEY_PLACEHOLDER } from '../constants';

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

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Kiểm tra API Key
      if (!GEMINI_API_KEY || GEMINI_API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
        throw new Error("API Key không được cấu hình");
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      });
      
      // Tạo prompt đơn giản hơn
      const context = `Bạn là EduBot, trợ lý ảo của hệ thống quản lý sinh viên EduChain. Người dùng: ${user?.fullName} (${user?.role}). Trả lời ngắn gọn bằng tiếng Việt.`;
      
      const prompt = `${context}\n\nCâu hỏi: ${userMessage}\n\nTrả lời:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const botText = response.text();
      
      if (botText && botText.trim()) {
        setMessages(prev => [...prev, { role: 'model', text: botText.trim() }]);
      } else {
        throw new Error("Không nhận được phản hồi từ AI");
      }
    } catch (error: any) {
      console.error("ChatBot Error:", error);
      
      let errorMessage = "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn.";
      
      if (error?.message?.includes('API key')) {
        errorMessage = "Lỗi: API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình.";
      } else if (error?.status === 403 || error?.message?.includes('403')) {
        errorMessage = "Lỗi 403: Gemini API không khả dụng ở khu vực này hoặc API key bị chặn.";
      } else if (error?.status === 429 || error?.message?.includes('429')) {
        errorMessage = "Lỗi 429: Quá nhiều yêu cầu. Vui lòng đợi một chút.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
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
