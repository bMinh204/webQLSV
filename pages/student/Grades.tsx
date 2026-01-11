
import React, { useState } from 'react';
import { MOCK_GRADES, MOCK_COURSES } from '../../constants';
import { GraduationCap, Filter, Download, Info } from 'lucide-react';

const GradesPage: React.FC = () => {
  const [semester, setSemester] = useState('2023-2024.1');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kết quả học tập</h1>
          <p className="text-slate-500">Tra cứu điểm chi tiết từng học kỳ.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-medium">
            <Download className="w-4 h-4" />
            Xuất bảng điểm (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="2023-2024.1">Học kỳ 1 (2023 - 2024)</option>
                <option value="2022-2023.2">Học kỳ 2 (2022 - 2023)</option>
                <option value="2022-2023.1">Học kỳ 1 (2022 - 2023)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-blue-50 rounded-xl">
              <span className="text-xs text-blue-500 font-semibold block">GPA Học kỳ</span>
              <span className="text-xl font-bold text-blue-700">3.45</span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-xl">
              <span className="text-xs text-emerald-500 font-semibold block">Tín chỉ Đạt</span>
              <span className="text-xl font-bold text-emerald-700">18 / 18</span>
            </div>
            <div className="px-4 py-2 bg-purple-50 rounded-xl">
              <span className="text-xs text-purple-500 font-semibold block">Xếp loại</span>
              <span className="text-xl font-bold text-purple-700">Giỏi</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 rounded-l-xl">Mã MH</th>
                <th className="px-6 py-4">Tên môn học</th>
                <th className="px-6 py-4 text-center">Tín chỉ</th>
                <th className="px-6 py-4 text-center">Quá trình (30%)</th>
                <th className="px-6 py-4 text-center">Cuối kỳ (70%)</th>
                <th className="px-6 py-4 text-center">Tổng kết</th>
                <th className="px-6 py-4 text-center">Điểm chữ</th>
                <th className="px-6 py-4 rounded-r-xl text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_GRADES.map((grade) => {
                const course = MOCK_COURSES.find(c => c.id === grade.courseId);
                return (
                  <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">{course?.code}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">{course?.name}</p>
                    </td>
                    <td className="px-6 py-5 text-center text-sm">{course?.credits}</td>
                    <td className="px-6 py-5 text-center text-sm">{grade.processGrade}</td>
                    <td className="px-6 py-5 text-center text-sm">{grade.finalGrade}</td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-blue-600">{grade.totalGrade}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-bold text-slate-800">{grade.letterGrade}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        grade.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {grade.status === 'Pass' ? 'Đạt' : 'Trượt'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-600">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            <strong>Cách tính điểm:</strong> Điểm tổng kết = (Điểm quá trình * 0.3) + (Điểm cuối kỳ * 0.7). <br/>
            Điểm chữ quy đổi: A (8.5 - 10), B (7.0 - 8.4), C (5.5 - 6.9), D (4.0 - 5.4), F (Dưới 4.0).
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
