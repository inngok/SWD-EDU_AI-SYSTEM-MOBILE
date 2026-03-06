import "./global.css";
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Menu, Bell, GraduationCap } from 'lucide-react-native';

// Features
import { StudentDashboard } from './src/features/dashboard/student/StudentDashboard';
import { AdminDashboard } from './src/features/dashboard/admin/AdminDashboard';
import { ProfileScreen } from './src/features/profile/ProfileScreen';
import { StudentCoursesScreen } from './src/features/course/StudentCoursesScreen';
import { userApi } from './src/features/profile/api/user-api';
import { Sidebar } from './src/features/layout/Sidebar';
import { LoginScreen } from './src/features/auth/LoginScreen';
import { TeacherCoursesScreen } from './src/features/dashboard/teacher/TeacherCoursesScreen';
import { TeacherClassesScreen } from './src/features/dashboard/teacher/TeacherClassesScreen';

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'Student', 'Admin'
  const [userData, setUserData] = useState(null);

  // UI State
  const [activeTab, setActiveTab] = useState('student'); // Controls which dashboard is visible (if logged in)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      const response = await userApi.getCurrentUser();
      console.log('[AUTH] Auto-login response raw content:', JSON.stringify(response));

      const userData = response.data?.data || response.data || response;

      // Hàm normalize vai trò cực kỳ mạnh mẽ - Ưu tiên Tên hơn ID
      const extractRole = (data) => {
        const findInObj = (obj) => {
          if (!obj) return null;

          // 1. Ưu tiên các trường Tên vai trò (String) hoặc Đối tượng vai trò (Object)
          // Vì ID đôi khi bị sai lệnh (ví dụ: 4 nhưng tên là Teacher)
          const nameFields = ['roleName', 'role_name', 'RoleName', 'role'];
          for (const key of nameFields) {
            const val = obj[key];
            if (val && (typeof val === 'object' || (typeof val === 'string' && isNaN(val)))) return val;
          }

          // 2. Sau đó mới tìm đến các ID số
          return obj.roleId || obj.role_id || obj.Role || obj.role;
        };

        const raw = findInObj(data);
        console.log('[AUTH] Raw role field found:', JSON.stringify(raw));

        if (!raw) return 'Student';

        // Normalization với hỗ trợ tiếng Việt
        let userRoleFallback = 'Student';
        const roleId = (typeof raw === 'object') ? (raw.id || raw.roleId || 0) : raw;
        const roleName = String((typeof raw === 'object') ? (raw.name || raw.code || '') : (raw || '')).toLowerCase();

        console.log(`[AUTH] Normalizing role -> Final ID: ${roleId}, Final Name: ${roleName}`);

        // KIỂM TRA THEO TÊN TRƯỚC (Vì tên thường chính xác hơn ID trong TH mâu thuẫn)
        if (roleName.includes('admin') || roleName.includes('quản trị')) return 'Admin';
        if (roleName.includes('teacher') || roleName.includes('giáo viên') || roleName.includes('giảng viên')) return 'Teacher';
        if (roleName.includes('manager') || roleName.includes('quản lý')) return 'Manager';
        if (roleName.includes('student') || roleName.includes('sinh viên') || roleName.includes('học viên')) return 'Student';

        // KIỂM TRA THEO ID NẾU TÊN KHÔNG RÕ RÀNG
        if (roleId == 1 || roleId === '1') return 'Admin';
        if (roleId == 3 || roleId === '3') return 'Teacher';
        if (roleId == 2 || roleId === '2') return 'Manager';
        if (roleId == 4 || roleId === '4') return 'Student';

        return userRoleFallback;
      };

      const uRole = extractRole(userData);
      console.log('[AUTH] Auto-login finalized role:', uRole);

      setUserData(userData);
      setUserRole(uRole);
      setActiveTab(uRole.toLowerCase());
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('[AUTH] Auto-login: Token expired or invalid');
      } else {
        console.error('[AUTH] Auto-login failed with unexpected error:', error);
      }
      await AsyncStorage.removeItem('token');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLoginSuccess = (normalizedRole, fullUserData) => {
    console.log('[AUTH] Login Success handler received final role:', normalizedRole);

    // Simple assignment as it's already normalized by LoginScreen
    setIsAuthenticated(true);
    setUserRole(normalizedRole);
    setUserData(fullUserData);

    // Set default tab based on role
    if (normalizedRole === 'Admin') setActiveTab('admin');
    else if (normalizedRole === 'Teacher') setActiveTab('teacher_courses');
    else setActiveTab('student');
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('student');
    setIsSidebarOpen(false);
    await AsyncStorage.removeItem('token');
  };

  const renderContent = () => {
    const role = String(userRole || '').toLowerCase();
    const tab = String(activeTab || '').toLowerCase();

    console.log('[DEBUG] Rendering Content -> Role:', role, 'Tab:', tab);

    // 1. Check Profile first
    if (tab === 'profile') return <ProfileScreen />;

    // 2. Role-based Dashboards
    if (role === 'admin') {
      return <AdminDashboard />;
    }

    if (role === 'teacher') {
      switch (tab) {
        case 'teacher_classes':
          return <TeacherClassesScreen user={userData} />;
        case 'teacher_courses':
        default:
          return <TeacherCoursesScreen user={userData} />;
      }
    }

    // 3. Student / Default
    switch (tab) {
      case 'student_courses':
        return <StudentCoursesScreen />;
      case 'student_tests':
        return <View className="flex-1 justify-center items-center"><Text className="text-gray-500 font-bold">Trang Bài kiểm tra đang phát triển</Text></View>;
      case 'student_progress':
        return <View className="flex-1 justify-center items-center"><Text className="text-gray-500 font-bold">Trang Tiến độ đang phát triển</Text></View>;
      default:
        return <StudentDashboard />;
    }
  };

  // Show loading indicator while checking auth token
  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {!isAuthenticated ? (
        <SafeAreaView className="flex-1 bg-white">
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </SafeAreaView>
      ) : (
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Top Header / Navigation */}
          <View className="flex-row justify-between items-center px-6 pt-4 pb-4 bg-white border-b border-gray-100 z-10">
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
              <Menu color="#374151" size={24} />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <GraduationCap size={24} color="#1d4ed8" />
              <Text className="font-bold text-lg text-[#0f172a] ml-2">EDU-AI Classroom</Text>
            </View>

            <View className="relative">
              <Bell color="#374151" size={24} />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </View>
          </View>

          {/* Main Content Area */}
          <View className="flex-1 relative">
            {renderContent()}
          </View>

          {/* Sidebar Overlay */}
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              userRole={userRole}
              activeTab={activeTab}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }}
              onLogout={handleLogout}
            />
          )}

          <StatusBar style="dark" />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
