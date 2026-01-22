
import React, { useEffect, useRef, useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Minimize2, 
  Send, 
  User as UserIcon, 
  X,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Bộ tri thức cơ sở mở rộng của EduBot
const KNOWLEDGE_BASE = [
  {
    keywords: ['điểm', 'kết quả', 'gpa', 'học lực', 'chưa đạt', 'hỏng'],
    response: "Bạn có thể xem điểm chi tiết tại mục 'Kết quả học tập'. Hệ thống hiển thị điểm quá trình (30%) và điểm cuối kỳ (70%). Những môn có điểm tổng kết dưới 4.0 sẽ hiển thị trạng thái 'Chưa đạt'."
  },
  {
    keywords: ['học phí', 'tiền học', 'nộp tiền', 'bán trú', 'phụ phí'],
    response: "Thông tin học phí được cập nhật trong mục 'Tài chính sinh viên'. Hạn nộp thường vào tuần thứ 4 của học kỳ. Bạn có thể thanh toán qua các ngân hàng liên kết hoặc cổng thanh toán trực tuyến của nhà trường."
  },
  {
    keywords: ['phúc khảo', 'xem lại bài', 'khiếu nại điểm'],
    response: "Thời gian nhận đơn phúc khảo là 7 ngày kể từ khi công bố điểm học phần chính thức. Bạn cần làm đơn theo mẫu và gửi trực tiếp tại Văn phòng Khoa hoặc qua cổng Dịch vụ sinh viên trực tuyến."
  },
  {
    keywords: ['thực tập', 'doanh nghiệp', 'kiến tập'],
    response: "Chương trình thực tập thường dành cho sinh viên năm cuối. Danh sách các doanh nghiệp liên kết được cập nhật định kỳ trên bản tin 'Thông báo' và website hướng nghiệp của trường."
  },
  {
    keywords: ['tốt nghiệp', 'xét bằng', 'cấp bằng', 'ra trường'],
    response: "Để xét tốt nghiệp, bạn cần hoàn thành đủ số tín chỉ quy định, có chứng chỉ Tiếng Anh (IELTS 6.0+) và Tin học, đồng thời điểm rèn luyện trung bình phải đạt từ 70 trở lên."
  },
  {
    keywords: ['ngoại khóa', 'clb', 'câu lạc bộ', 'đoàn hội'],
    response: "Trường có hơn 30 câu lạc bộ từ học thuật đến nghệ thuật. Bạn có thể đăng ký tham gia vào đầu mỗi học kỳ tại Ngày hội CLB (Club's Day) hoặc xem thông tin tại mục 'Hoạt động ngoại khóa'."
  },
  {
    keywords: ['lịch học', 'thời khóa biểu', 'phòng học'],
    response: "Lịch học tuần của bạn được cập nhật tại mục 'Lịch học & Thi'. Bạn có thể xem mã phòng, tên giảng viên và thời gian học tại đó."
  },
  {
    keywords: ['lịch thi', 'thi cử', 'phòng thi', 'số báo danh'],
    response: "Thông tin lịch thi học kỳ (ngày, giờ, phòng thi, SBD) có sẵn trong tab 'Lịch thi' thuộc mục 'Lịch học & Thi'."
  },
  {
    keywords: ['mật khẩu', 'đổi pass', 'bảo mật'],
    response: "Để đảm bảo an toàn, bạn nên đổi mật khẩu định kỳ tại trang 'Hồ sơ cá nhân' -> 'Đổi mật khẩu'."
  },
  {
    keywords: ['đăng ký', 'tín chỉ', 'môn học'],
    response: "Việc đăng ký tín chỉ được thực hiện vào đầu mỗi học kỳ. Vui lòng theo dõi 'Thông báo' để biết thời gian mở cổng đăng ký chính xác."
  },
  {
    keywords: ['liên hệ', 'hỗ trợ', 'kỹ thuật'],
    response: "Nếu gặp sự cố kỹ thuật, bạn vui lòng gửi email về phòng đào tạo: support@university.edu.vn hoặc liên hệ hotline: 1900 1234."
  },
  {
    keywords: ['chào', 'hello', 'hi'],
    response: "Xin chào! Tôi là EduBot. Tôi có thể giúp bạn tìm thông tin về điểm số, lịch học, lịch thi, học phí và các quy định học vụ. Bạn muốn hỏi gì nào?"
  }
];

const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Chào ${user?.fullName}! Tôi là EduBot, trợ lý ảo của EduChain. Tôi giúp gì được cho bạn?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getBotResponse = (userInput: string): string => {
    const inputLower = userInput.toLowerCase();
    
    // Tìm kiếm trong bộ tri thức
    const match = KNOWLEDGE_BASE.find(item => 
      item.keywords.some(keyword => inputLower.includes(keyword))
    );

    if (match) return match.response;

    return "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi về: điểm số, học phí, phúc khảo, tốt nghiệp, hoặc lịch thi.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // Giả lập độ trễ suy nghĩ của Bot
    setTimeout(() => {
      const botResponse = getBotResponse(userText);
      setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickInquiry = (text: string) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold leading-none tracking-tight">EduBot AI Assistant</h3>
                <p className="text-[10px] text-blue-100 mt-1.5 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online Now
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm ${
                    m.role === 'user' ? 'bg-white border-slate-200' : 'bg-blue-600 border-blue-600 text-white'
                  }`}>
                    {m.role === 'user' ? <UserIcon className="w-4 h-4 text-slate-500" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2.5 items-center bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">EduBot is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {!isTyping && (
            <div className="px-4 py-3 bg-white border-t border-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
              {['Học phí', 'Phúc khảo', 'Tốt nghiệp', 'CLB'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleQuickInquiry(suggestion)}
                  className="px-4 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl text-[11px] font-black transition-all shrink-0 border border-slate-100 hover:border-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-50">
            <div className="relative">
              <input 
                type="text"
                placeholder="Hỏi tôi về học phí, điểm số..."
                className="w-full pl-4 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-[13px] font-bold"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isTyping || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 p-4 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {!isOpen && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-black text-[10px] uppercase tracking-widest pl-2">
            AI Help Desk
          </span>
        )}
        {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;
