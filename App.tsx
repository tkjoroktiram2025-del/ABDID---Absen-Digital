import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  ClipboardList, 
  Settings, 
  LogOut, 
  UserCircle,
  School,
  History,
  CheckCircle,
  Menu,
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Role, User, ViewState, AttendanceRecord, AttendanceStatus, SchoolConfig } from './types';
import { MOCK_USERS, MOCK_ATTENDANCE, INITIAL_CONFIG } from './constants';
import { Button } from './components/Button';
import { generateAttendanceReport } from './services/geminiService';

// --- Components defined inline for file constraint adherence, but structured cleanly ---

// 1. LOGIN COMPONENT
const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Mock Login Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => (u.email === email || u.nip_nisn === email) && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Try admin@abdig.com / password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-900 mb-4">
            <School size={32} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">ABDIG</h1>
          <p className="text-gray-500 text-sm">Absensi Digital Terintegrasi</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isRegister ? 'bg-white text-primary-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isRegister ? 'bg-white text-primary-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setIsRegister(true)}
          >
            Registrasi
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {isRegister && (
             <>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nama Lengkap" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="SISWA">Siswa</option>
                  <option value="GURU">Guru</option>
                </select>
              </div>
             </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email / NIP / NISN</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
              placeholder="admin@abdig.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
              placeholder="password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full justify-center">
            {isRegister ? 'Daftar Sekarang' : 'Masuk Sistem'}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ABDIG System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

// 2. DASHBOARD VIEW (ADMIN)
const AdminDashboard = ({ 
  attendance, 
  users 
}: { 
  attendance: AttendanceRecord[], 
  users: User[] 
}) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecs = attendance.filter(a => a.date === today);
    return {
      guruHadir: todayRecs.filter(a => a.userRole === Role.GURU && a.status === AttendanceStatus.HADIR).length,
      siswaHadir: todayRecs.filter(a => a.userRole === Role.SISWA && a.status === AttendanceStatus.HADIR).length,
      totalGuru: users.filter(u => u.role === Role.GURU).length,
      totalSiswa: users.filter(u => u.role === Role.SISWA).length,
    };
  }, [attendance, users]);

  const chartData = [
    { name: 'Senin', Hadir: 45, Sakit: 2, Alpha: 1 },
    { name: 'Selasa', Hadir: 47, Sakit: 1, Alpha: 0 },
    { name: 'Rabu', Hadir: 42, Sakit: 4, Alpha: 2 },
    { name: 'Kamis', Hadir: 48, Sakit: 0, Alpha: 0 },
    { name: 'Jumat', Hadir: 40, Sakit: 5, Alpha: 3 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Guru Hadir', val: stats.guruHadir, total: stats.totalGuru, color: 'bg-blue-500' },
          { label: 'Siswa Hadir', val: stats.siswaHadir, total: stats.totalSiswa, color: 'bg-emerald-500' },
          { label: 'Izin / Sakit', val: 3, total: null, color: 'bg-yellow-500' },
          { label: 'Alpha', val: 1, total: null, color: 'bg-red-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {item.val} <span className="text-sm text-gray-400 font-normal">{item.total ? `/ ${item.total}` : ''}</span>
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full ${item.color} opacity-20`}></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Statistik Kehadiran Mingguan</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Hadir" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sakit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Alpha" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 3. TEACHER ABSENCE VIEW
const TeacherAbsence = ({ user, onClockIn }: { user: User, onClockIn: () => void }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-600 mb-2">{today}</h2>
        <div className="text-6xl font-bold text-primary-900 mb-8 font-mono">{timeStr}</div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onClockIn}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <CheckCircle size={24} />
            <span className="text-lg font-bold">Absen Masuk</span>
          </button>
           <button 
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <LogOut size={24} />
            <span className="text-lg font-bold">Absen Pulang</span>
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-400">
          Jadwal Masuk: 07:00 WIB • Toleransi: 15 Menit
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <History size={20} /> Riwayat Absensi Saya
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Jam Masuk</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">{today}</td>
                <td className="px-6 py-4">06:45</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Hadir</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. CLASS ABSENCE VIEW (WALI KELAS)
const ClassAbsence = ({ user, students, onSubmit }: { user: User, students: User[], onSubmit: (data: any) => void }) => {
  const [classData, setClassData] = useState<Record<string, AttendanceStatus>>({});
  
  // Initialize all to HADIR
  useEffect(() => {
    const init: any = {};
    students.forEach(s => init[s.id] = AttendanceStatus.HADIR);
    setClassData(init);
  }, [students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setClassData(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-heading font-bold text-gray-800">Absensi Kelas {user.assignedClass}</h2>
           <p className="text-gray-500 text-sm">Kelola kehadiran siswa harian.</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-primary-900">{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Nama Siswa</th>
              <th className="px-6 py-4 text-center">Hadir</th>
              <th className="px-6 py-4 text-center">Sakit</th>
              <th className="px-6 py-4 text-center">Izin</th>
              <th className="px-6 py-4 text-center">Alpha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {student.avatar && <img src={student.avatar} alt="" className="w-full h-full object-cover" />}
                  </div>
                  {student.name}
                </td>
                {[AttendanceStatus.HADIR, AttendanceStatus.SAKIT, AttendanceStatus.IZIN, AttendanceStatus.ALPHA].map(status => (
                  <td key={status} className="px-6 py-4 text-center">
                    <input 
                      type="radio" 
                      name={`status-${student.id}`}
                      checked={classData[student.id] === status}
                      onChange={() => handleStatusChange(student.id, status)}
                      className={`w-5 h-5 cursor-pointer accent-primary-600 ${
                        status === AttendanceStatus.ALPHA ? 'accent-red-500' : 
                        status === AttendanceStatus.SAKIT ? 'accent-yellow-500' : 
                        'accent-primary-600'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSubmit(classData)}>
          Simpan Data Absensi
        </Button>
      </div>
    </div>
  );
};

// 5. REPORTS VIEW (ADMIN + AI)
const ReportsView = ({ attendance }: { attendance: AttendanceRecord[] }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateReport = async () => {
    setLoadingAi(true);
    const report = await generateAttendanceReport(attendance, Role.SISWA); // Focus on students for demo
    setAiReport(report);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-gray-800">Laporan & Analisis</h2>
        <Button variant="outline" onClick={handleGenerateReport} isLoading={loadingAi}>
          <Sparkles size={16} />
          {loadingAi ? 'Generating...' : 'Ask AI Insights'}
        </Button>
      </div>

      {aiReport && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" /> 
            AI Executive Summary
          </h3>
          <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">{aiReport}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Log Aktivitas Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendance.map(rec => (
                <tr key={rec.id}>
                  <td className="px-6 py-4">{rec.timeIn || '-'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{rec.userName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${rec.userRole === Role.GURU ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {rec.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${rec.status === 'Hadir' ? 'bg-green-100 text-green-700' : 
                        rec.status === 'Sakit' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. MAIN APP LAYOUT & LOGIC
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [config, setConfig] = useState<SchoolConfig>(INITIAL_CONFIG);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Auto-redirect based on role after login
  useEffect(() => {
    if (user) {
      if (user.role === Role.ADMIN) setView('DASHBOARD');
      else if (user.role === Role.GURU) setView('TEACHER_ATTENDANCE');
      else setView('STUDENT_HISTORY');
    } else {
      setView('LOGIN');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setSidebarOpen(true);
  };

  const handleClockIn = () => {
    if (!user) return;
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      date: new Date().toISOString().split('T')[0],
      timeIn: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
      status: AttendanceStatus.HADIR,
    };
    setAttendance([newRecord, ...attendance]);
    alert("Berhasil Absen Masuk!");
  };

  const handleClassSubmit = (data: Record<string, AttendanceStatus>) => {
    // Convert map to records
    const newRecords = Object.entries(data).map(([sid, status]) => {
      const student = MOCK_USERS.find(u => u.id === sid);
      return {
        id: Math.random().toString(),
        userId: sid,
        userName: student?.name || 'Unknown',
        userRole: Role.SISWA,
        class: user?.assignedClass,
        date: new Date().toISOString().split('T')[0],
        timeIn: status === AttendanceStatus.HADIR ? '07:00' : undefined,
        status: status
      } as AttendanceRecord;
    });
    setAttendance([...newRecords, ...attendance]);
    alert("Absensi Kelas Berhasil Disimpan!");
  };

  // Sidebar Menu Items Generator
  const getMenuItems = () => {
    if (!user) return [];
    const items = [];
    
    if (user.role === Role.ADMIN) {
      items.push({ id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard });
      items.push({ id: 'MANAGE_USERS', label: 'Data Pengguna', icon: Users });
      items.push({ id: 'REPORTS', label: 'Laporan', icon: FileText });
      items.push({ id: 'SETTINGS', label: 'Pengaturan', icon: Settings });
    }
    
    if (user.role === Role.GURU) {
      items.push({ id: 'TEACHER_ATTENDANCE', label: 'Absen Saya', icon: CalendarCheck });
      if (user.assignedClass) {
        items.push({ id: 'CLASS_ATTENDANCE', label: `Wali Kelas (${user.assignedClass})`, icon: ClipboardList });
      }
    }

    if (user.role === Role.SISWA) {
      items.push({ id: 'STUDENT_HISTORY', label: 'Riwayat Absen', icon: History });
    }

    return items;
  };

  if (view === 'LOGIN') {
    return <LoginView onLogin={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-primary-800 flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg">
               <School size={24} className="text-white" />
             </div>
             <div>
               <h1 className="font-heading font-bold text-lg tracking-wide">ABDIG</h1>
               <p className="text-xs text-primary-200 opacity-70">v1.0.0</p>
             </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-xs font-semibold text-primary-400 uppercase px-4 mb-2">Menu Utama</p>
            {getMenuItems().map(item => (
              <button
                key={item.id}
                onClick={() => {
                   setView(item.id as ViewState);
                   if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-primary-800 text-white shadow-lg' : 'text-primary-100 hover:bg-primary-800/50'}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-200 hover:bg-red-900/30 transition-colors"
            >
              <LogOut size={20} />
              Keluar Aplikasi
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">{config.name}</h2>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 overflow-hidden border border-primary-200">
              {user?.avatar ? <img src={user.avatar} alt="Profile" /> : <UserCircle size={24} />}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {view === 'DASHBOARD' && <AdminDashboard attendance={attendance} users={MOCK_USERS} />}
          {view === 'TEACHER_ATTENDANCE' && user && <TeacherAbsence user={user} onClockIn={handleClockIn} />}
          {view === 'CLASS_ATTENDANCE' && user && (
            <ClassAbsence 
              user={user} 
              students={MOCK_USERS.filter(u => u.role === Role.SISWA && u.assignedClass === user.assignedClass)} 
              onSubmit={handleClassSubmit} 
            />
          )}
          {view === 'REPORTS' && <ReportsView attendance={attendance} />}
          {view === 'STUDENT_HISTORY' && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h2 className="text-xl font-bold mb-4">Riwayat Kehadiran</h2>
               <p className="text-gray-500">Anda tidak memiliki izin untuk melakukan absen mandiri.</p>
               {/* Simplified student view */}
               <div className="mt-4 space-y-2">
                 {attendance.filter(a => a.userId === user?.id).map(r => (
                   <div key={r.id} className="p-4 border rounded-lg flex justify-between items-center">
                     <span>{r.date}</span>
                     <span className="font-bold text-green-600">{r.status}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {/* Placeholder views for incomplete sections */}
          {(view === 'MANAGE_USERS' || view === 'SETTINGS') && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Settings size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Modul ini sedang dalam pengembangan.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
