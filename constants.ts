import { Role, User, AttendanceStatus, AttendanceRecord, SchoolConfig } from './types';

export const INITIAL_CONFIG: SchoolConfig = {
  name: 'SMA Negeri 1 Digital',
  address: 'Jl. Pendidikan No. 1, Jakarta',
  year: '2023/2024',
  semester: 'Ganjil',
  entryTime: '07:00',
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Utama',
    email: 'admin@abdig.com',
    role: Role.ADMIN,
    nip_nisn: 'ADMIN001',
    password: 'password',
    avatar: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'Budi Santoso (Guru)',
    email: 'budi@guru.com',
    role: Role.GURU,
    nip_nisn: '198001012005011001',
    assignedClass: 'XII-IPA-1', // Wali Kelas
    password: 'password',
    avatar: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: 'Siti Aminah (Guru)',
    email: 'siti@guru.com',
    role: Role.GURU,
    nip_nisn: '198502022005012002',
    password: 'password', // Not a Wali Kelas
    avatar: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: 'Ahmad Rizki',
    email: 'ahmad@siswa.com',
    role: Role.SISWA,
    nip_nisn: '0051234567',
    assignedClass: 'XII-IPA-1',
    password: 'password',
    avatar: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: '5',
    name: 'Dewi Lestari',
    email: 'dewi@siswa.com',
    role: Role.SISWA,
    nip_nisn: '0051234568',
    assignedClass: 'XII-IPA-1',
    password: 'password',
    avatar: 'https://picsum.photos/200/200?random=5'
  },
  {
    id: '6',
    name: 'Eko Prasetyo',
    email: 'eko@siswa.com',
    role: Role.SISWA,
    nip_nisn: '0051234569',
    assignedClass: 'XII-IPS-1',
    password: 'password',
    avatar: 'https://picsum.photos/200/200?random=6'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'a1',
    userId: '2',
    userName: 'Budi Santoso',
    userRole: Role.GURU,
    date: new Date().toISOString().split('T')[0],
    timeIn: '06:45',
    status: AttendanceStatus.HADIR,
  },
  {
    id: 'a2',
    userId: '4',
    userName: 'Ahmad Rizki',
    userRole: Role.SISWA,
    class: 'XII-IPA-1',
    date: new Date().toISOString().split('T')[0],
    timeIn: '07:00',
    status: AttendanceStatus.HADIR,
  },
  {
    id: 'a3',
    userId: '5',
    userName: 'Dewi Lestari',
    userRole: Role.SISWA,
    class: 'XII-IPA-1',
    date: new Date().toISOString().split('T')[0],
    status: AttendanceStatus.SAKIT,
    notes: 'Demam tinggi',
  }
];
