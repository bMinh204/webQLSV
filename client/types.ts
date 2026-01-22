
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  avatar?: string;
  details?: StudentDetails | TeacherDetails;
}

export interface StudentDetails {
  studentId: string;
  dob: string;
  gender: string;
  class: string;
  faculty: string;
  major: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Graduated';
  gpa: number;
  totalCredits: number;
}

export interface TeacherDetails {
  employeeId: string;
  faculty: string;
  title: string;
  phone: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  teacherId: string;
  semester: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  processGrade: number;
  midtermGrade: number;
  finalGrade: number;
  totalGrade: number;
  letterGrade: string;
  status: 'Pass' | 'Fail';
}

export interface StudentTranscript {
  subjectCode: string;
  subjectName: string;
  credits: number;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 1 for Monday, 7 for Sunday
  timeSlot: string;
  room: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
}

export interface ExamScheduleItem {
  id: string;
  courseName: string;
  courseCode: string;
  date: string;
  time: string;
  room: string;
  format: 'Trắc nghiệm' | 'Tự luận' | 'Vấn đáp' | 'Đồ án';
  seatNumber: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'General' | 'Exam' | 'Schedule' | 'Personal';
}

export interface Student {
  _id?: string;
  studentId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'danger';
  timestamp?: Date;
  isRead?: boolean;
  read?: boolean;
  date?: string;
}

export const MOCK_TRANSCRIPT: StudentTranscript[] = [
  {
    subjectCode: 'CS101',
    subjectName: 'Lập trình căn bản',
    credits: 3,
    attendance: 95,
    midterm: 8.5,
    final: 9.0,
    total: 8.8,
    letter: 'A',
    status: 'PASS'
  },
  {
    subjectCode: 'MATH201',
    subjectName: 'Toán cao cấp',
    credits: 4,
    attendance: 80,
    midterm: 6.0,
    final: 5.5,
    total: 5.7,
    letter: 'D',
    status: 'WARNING'
  }
];
