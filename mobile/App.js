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
      const userData = response.data || response;
      const roleValue = userData.roleId || userData.role_id || userData.role;

      let uRole = 'Student';
      if (roleValue === 1 || String(roleValue).toLowerCase() === 'admin') uRole = 'Admin';
      // else logic for manager/teacher removed as requested, redirect all to student if not admin.

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
    setIsAuthenticated(true);
    setUserRole(role);
    setActiveTab(String(role).toLowerCase());
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('student');
    setIsSidebarOpen(false);
    await AsyncStorage.removeItem('token');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'admin': return <AdminDashboard />;
      case 'profile': return <ProfileScreen />;
      default: return <StudentDashboard />;
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
    </SafeAreaProvider>
  );
}
