export enum Role {
  ADMIN = 'ADMIN',
  GURU = 'GURU',
  SISWA = 'SISWA',
}

export enum AttendanceStatus {
  HADIR = 'Hadir',
  IZIN = 'Izin',
  SAKIT = 'Sakit',
  ALPHA = 'Alpha',
  TERLAMBAT = 'Terlambat',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  nip_nisn: string;
  password?: string;
  assignedClass?: string; // For Siswa (their class) or Guru (Wali Kelas)
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  date: string; // YYYY-MM-DD
  timeIn?: string; // HH:mm
  timeOut?: string; // HH:mm
  status: AttendanceStatus;
  notes?: string;
  class?: string; // If student
}

export interface SchoolConfig {
  name: string;
  address: string;
  year: string;
  semester: string;
  entryTime: string;
  logoUrl?: string;
}

export type ViewState = 
  | 'LOGIN'
  | 'DASHBOARD'
  | 'MANAGE_USERS'
  | 'TEACHER_ATTENDANCE'
  | 'CLASS_ATTENDANCE' // Wali Kelas view
  | 'STUDENT_HISTORY'
  | 'REPORTS'
  | 'SETTINGS';
