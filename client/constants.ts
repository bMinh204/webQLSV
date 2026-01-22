
import { UserRole, User, Course, Grade, ScheduleItem, Announcement, ExamScheduleItem } from './types';

export const FACULTIES = [
  'Công nghệ thông tin',
  'Kinh tế & Quản trị',
  'Điện tử viễn thông',
  'Ngoại ngữ',
  'Cơ khí'
];

export const MOCK_USERS: User[] = [
  {
    id: 's1',
    username: 'SV00',
    fullName: 'Nguyễn Văn A',
    role: UserRole.STUDENT,
    email: 'nguyenvana@university.edu.vn',
    avatar: 'https://picsum.photos/seed/s1/200',
    details: {
      studentId: '21000123',
      dob: '2003-05-15',
      gender: 'Nam',
      class: 'K66-CNTT-A',
      faculty: 'Công nghệ thông tin',
      major: 'Khoa học máy tính',
      phone: '0987654321',
      status: 'Active',
      gpa: 3.45,
      totalCredits: 75
    }
  },
  {
    id: 's2',
    username: 'SV002',
    fullName: 'Lê Thị C',
    role: UserRole.STUDENT,
    email: 'lethic@university.edu.vn',
    avatar: 'https://picsum.photos/seed/s2/200',
    details: {
      studentId: '21000456',
      dob: '2003-08-20',
      gender: 'Nữ',
      class: 'K66-CNTT-A',
      faculty: 'Công nghệ thông tin',
      major: 'An toàn thông tin',
      phone: '0912333444',
      status: 'Active',
      gpa: 3.2,
      totalCredits: 72
    }
  },
  {
    id: 't1',
    username: 'GV001',
    fullName: 'TS. Trần Thị B',
    role: UserRole.TEACHER,
    email: 'tranthib@university.edu.vn',
    avatar: 'https://picsum.photos/seed/t1/200',
    details: {
      employeeId: 'GV10293',
      faculty: 'Công nghệ thông tin',
      title: 'Giảng viên chính',
      phone: '0912345678'
    }
  },
  {
    id: 'a1',
    username: 'admin',
    fullName: 'Hệ Thống Admin',
    role: UserRole.ADMIN,
    email: 'admin@university.edu.vn',
    avatar: 'https://picsum.photos/seed/admin/200'
  }
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', code: 'CS101', name: 'Lập trình cơ bản', credits: 3, teacherId: 't1', semester: '2023-2024.1' },
  { id: 'c2', code: 'CS202', name: 'Cấu trúc dữ liệu và Giải thuật', credits: 4, teacherId: 't1', semester: '2023-2024.1' },
  { id: 'c3', code: 'MATH1', name: 'Toán cao cấp A1', credits: 3, teacherId: 't2', semester: '2023-2024.1' },
  { id: 'c4', code: 'ENG1', name: 'Tiếng Anh chuyên ngành 1', credits: 2, teacherId: 't3', semester: '2023-2024.2' },
  { id: 'c5', code: 'AI101', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, teacherId: 't1', semester: '2023-2024.2' },
  { id: 'c6', code: 'DB201', name: 'Hệ quản trị Cơ sở dữ liệu', credits: 3, teacherId: 't4', semester: '2023-2024.1' },
];

export const MOCK_ENROLLMENTS = [
  { courseId: 'c1', studentId: 's1' },
  { courseId: 'c1', studentId: 's2' },
  { courseId: 'c2', studentId: 's1' },
  { courseId: 'c2', studentId: 's2' }
];

export const MOCK_GRADES: Grade[] = [
  { id: 'g1', studentId: 's1', courseId: 'c1', processGrade: 8.5, midtermGrade: 7.0, finalGrade: 9.0, totalGrade: 8.4, letterGrade: 'A', status: 'Pass' },
  { id: 'g2', studentId: 's1', courseId: 'c2', processGrade: 9.0, midtermGrade: 8.5, finalGrade: 6.0, totalGrade: 7.5, letterGrade: 'B+', status: 'Pass' },
  { id: 'g3', studentId: 's1', courseId: 'c3', processGrade: 5.0, midtermGrade: 4.0, finalGrade: 3.5, totalGrade: 4.1, letterGrade: 'D', status: 'Pass' }
];

export const MOCK_SCHEDULES: ScheduleItem[] = [
  { id: 'sch1', dayOfWeek: 1, timeSlot: '07:30 - 09:10', room: 'B1-201', courseName: 'Lập trình cơ bản', courseCode: 'CS101', teacherName: 'Trần Thị B' },
  { id: 'sch2', dayOfWeek: 1, timeSlot: '09:20 - 11:50', room: 'B1-201', courseName: 'Thực hành Lập trình', courseCode: 'CS101.Lab', teacherName: 'Trần Thị B' },
  { id: 'sch3', dayOfWeek: 3, timeSlot: '13:30 - 15:10', room: 'C2-405', courseName: 'Cấu trúc dữ liệu', courseCode: 'CS202', teacherName: 'Trần Thị B' },
  { id: 'sch4', dayOfWeek: 4, timeSlot: '07:30 - 10:00', room: 'D3-102', courseName: 'Toán cao cấp A1', courseCode: 'MATH1', teacherName: 'Nguyễn Văn C' },
  { id: 'sch5', dayOfWeek: 5, timeSlot: '15:20 - 17:00', room: 'B1-303', courseName: 'Kỹ năng mềm', courseCode: 'SOFT1', teacherName: 'Lê Thị D' },
];

export const MOCK_EXAMS: ExamScheduleItem[] = [
  { id: 'ex1', courseName: 'Lập trình cơ bản', courseCode: 'CS101', date: '2024-06-15', time: '07:30', room: 'B1-402', format: 'Trắc nghiệm', seatNumber: 'A-23' },
  { id: 'ex2', courseName: 'Cấu trúc dữ liệu và Giải thuật', courseCode: 'CS202', date: '2024-06-18', time: '13:30', room: 'C2-501', format: 'Tự luận', seatNumber: 'B-05' },
  { id: 'ex3', courseName: 'Toán cao cấp A1', courseCode: 'MATH1', date: '2024-06-22', time: '09:00', room: 'D3-202', format: 'Tự luận', seatNumber: 'C-12' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: 'Thông báo lịch thi giữa kỳ', content: 'Sinh viên xem lịch thi chi tiết tại phòng đào tạo...', date: '2024-03-20', type: 'Exam' },
  { id: 'ann2', title: 'Nghỉ học ngày 26/03', content: 'Toàn bộ sinh viên được nghỉ học nhân ngày kỷ niệm Đoàn TNCS...', date: '2024-03-24', type: 'General' }
];
