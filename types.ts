
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
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
