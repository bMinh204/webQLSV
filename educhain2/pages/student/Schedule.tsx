
import React, { useState } from 'react';
import { MOCK_SCHEDULES, MOCK_EXAMS } from '../../constants';
import { Calendar as CalendarIcon, Clock, MapPin, User, FileText, ChevronRight, ChevronLeft, Download, Info } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'study' | 'exam'>('study');
  
  const days = [
    { label: 'Thứ 2', value: 1 },
    { label: 'Thứ 3', value: 2 },
    { label: 'Thứ 4', value: 3 },
    { label: 'Thứ 5', value: 4 },
    { label: 'Thứ 6', value: 5 },
    { label: 'Thứ 7', value: 6 },
    { label: 'Chủ Nhật', value: 7 },
  ];

  const getScheduleByDay = (day: number) => {
    return MOCK_SCHEDULES.filter(s => s.dayOfWeek === day);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lịch trình cá nhân</h1>
          <p className="text-slate-500">Theo dõi lịch học hàng tuần và kế hoạch thi cử.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('study')}
            className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${
              activeTab === 'study' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lịch học tuần
          </button>
          <button 
            onClick={() => setActiveTab('exam')}
            className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${
              activeTab === 'exam' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lịch thi
          </button>
        </div>
      </header>

      {activeTab === 'study' ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-800">Tuần 34 (20/05 - 26/05/2024)</span>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {days.map((day) => {
              const daySchedules = getScheduleByDay(day.value);
              const isToday = day.value === new Date().getDay(); // Đơn giản hóa ví dụ

              return (
                <div key={day.value} className="space-y-4">
                  <div className={`p-3 rounded-xl text-center font-bold text-sm ${
                    isToday ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                  }`}>
                    {day.label}
                  </div>
                  
                  <div className="space-y-3">
                    {daySchedules.length > 0 ? daySchedules.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{item.courseCode}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {item.courseName}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-semibold text-slate-700">P. {item.room}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-50 pt-2">
                            <User className="w-3.5 h-3.5" />
                            <span className="truncate italic">{item.teacherName}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                        <span className="text-xs text-slate-300 italic">Trống</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-50 rounded-2xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">Lịch thi học kỳ</h3>
                   <p className="text-slate-500 text-sm">Học kỳ 2023.2 • Giai đoạn 2</p>
                 </div>
               </div>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
                 <Download className="w-4 h-4" />
                 Tải lịch thi
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4 rounded-l-xl">Môn học</th>
                    <th className="px-6 py-4 text-center">Ngày thi</th>
                    <th className="px-6 py-4 text-center">Giờ thi</th>
                    <th className="px-6 py-4 text-center">Phòng</th>
                    <th className="px-6 py-4 text-center">Số báo danh</th>
                    <th className="px-6 py-4 rounded-r-xl text-center">Hình thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_EXAMS.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <p className="font-bold text-slate-800">{exam.courseName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{exam.courseCode}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex flex-col items-center">
                           <span className="text-sm font-bold text-slate-700">{new Date(exam.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{exam.time}</span>
                      </td>
                      <td className="px-6 py-6 text-center font-bold text-slate-700">{exam.room}</td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded text-slate-600">{exam.seatNumber}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          exam.format === 'Trắc nghiệm' ? 'bg-emerald-100 text-emerald-700' :
                          exam.format === 'Tự luận' ? 'bg-amber-100 text-amber-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {exam.format}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-10 p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
              <Info className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-sm text-amber-800 leading-relaxed">
                <p className="font-bold mb-1">Quy định phòng thi:</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>Sinh viên có mặt trước giờ thi ít nhất 15 phút.</li>
                  <li>Mang theo Thẻ sinh viên hoặc Giấy tờ tùy thân có ảnh.</li>
                  <li>Tuyệt đối không sử dụng tài liệu trừ khi có thông báo cụ thể từ Giảng viên.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
