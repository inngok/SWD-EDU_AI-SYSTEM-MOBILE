import "./global.css";
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Menu, Bell } from 'lucide-react-native';

// Features
import { StudentDashboard } from './src/features/dashboard/student/StudentDashboard';
import { TeacherDashboard } from './src/features/dashboard/teacher/TeacherDashboard';
import { ManagerDashboard } from './src/features/dashboard/manager/ManagerDashboard';
import { AdminDashboard } from './src/features/dashboard/admin/AdminDashboard';
import { Sidebar } from './src/features/layout/Sidebar';
import { LoginScreen } from './src/features/auth/LoginScreen';

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'Student', 'Teacher', 'Manager', 'Admin'

  // UI State
  const [activeTab, setActiveTab] = useState('student'); // Controls which dashboard is visible (if logged in)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);

    // Map API role to our internal tab keys
    // Assuming API returns 'Student', 'Teacher', 'Manager', 'Admin'
    // We lower case it for our tab keys
    const tabKey = role ? role.toLowerCase() : 'student';
    setActiveTab(tabKey);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('student');
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'student':
      default:
        return <StudentDashboard />;
    }
  };

  // If not authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Top Header / Navigation */}
        <View className="flex-row justify-between items-center px-6 pt-4 pb-4 bg-white border-b border-gray-100 z-10">
          <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
            <Menu color="#374151" size={24} />
          </TouchableOpacity>

          <Text className="font-bold text-lg text-gray-800">EduSystem</Text>

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
    </SafeAreaProvider>
  );
}
