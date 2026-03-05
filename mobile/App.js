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

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'Student', 'Admin'

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

      // Hàm normalize vai trò cực kỳ mạnh mẽ
      const extractRole = (data) => {
        const raw = data.roleId || data.role_id || data.role;
        console.log('[AUTH] Raw role field found:', JSON.stringify(raw));

        if (!raw) return 'Student';

        // Trích xuất ID và Name từ Object hoặc Giá trị đơn
        const id = (typeof raw === 'object') ? (raw.id || raw.roleId || 0) : raw;
        const name = String((typeof raw === 'object') ? (raw.name || raw.code || '') : raw).toLowerCase();

        console.log(`[AUTH] Normalized role details -> ID: ${id}, Name: ${name}`);

        if (id == 1 || id === '1' || name.includes('admin')) return 'Admin';
        if (id == 3 || id === '3' || name.includes('teacher')) return 'Teacher';
        if (id == 2 || id === '2' || name.includes('manager')) return 'Manager';
        return 'Student';
      };

      const uRole = extractRole(userData);
      console.log('[AUTH] Auto-login finalized role:', uRole);

      setUserRole(uRole);
      setActiveTab(uRole.toLowerCase());
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auto login failed', error);
      await AsyncStorage.removeItem('token');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLoginSuccess = (role) => {
    console.log('[AUTH] Login Success handler received raw role:', JSON.stringify(role));

    // Đảm bảo role được chuẩn hóa lần cuối
    let normalizedRole = 'Student';
    const roleStr = String(role || '').toLowerCase();

    // Check cả ID number, ID string và Name
    if (role == 1 || role === '1' || roleStr.includes('admin')) {
      normalizedRole = 'Admin';
    } else if (role == 3 || role === '3' || roleStr.includes('teacher')) {
      normalizedRole = 'Teacher';
    } else if (role == 2 || role === '2' || roleStr.includes('manager')) {
      normalizedRole = 'Manager';
    }

    console.log('[AUTH] Login Success normalized to:', normalizedRole);
    setIsAuthenticated(true);
    setUserRole(normalizedRole);
    setActiveTab(normalizedRole.toLowerCase());
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('student');
    setIsSidebarOpen(false);
    await AsyncStorage.removeItem('token');
  };

  const renderContent = () => {
    console.log('[DEBUG] Rendering Content for Tab:', activeTab, 'Role:', userRole);

    switch (activeTab) {
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <ProfileScreen />;
      case 'student_courses':
        return <StudentCoursesScreen />;
      case 'student_tests':
        // Placeholder or actual component when ready
        return <View className="flex-1 justify-center items-center"><Text className="text-gray-500 font-bold">Trang Bài kiểm tra đang phát triển</Text></View>;
      case 'student_progress':
        // Placeholder or actual component when ready
        return <View className="flex-1 justify-center items-center"><Text className="text-gray-500 font-bold">Trang Tiến độ đang phát triển</Text></View>;
      case 'student':
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
