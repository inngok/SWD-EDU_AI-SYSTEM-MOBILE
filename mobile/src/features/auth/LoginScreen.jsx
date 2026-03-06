import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { authApi } from './api/auth-api';
import { userApi } from '../profile/api/user-api';

export const LoginScreen = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const data = await authApi.login({
                email: username,
                password: password,
            });

            // Backend returns response.data which we get as `data` here (from axios interceptor)
            const responseData = data.data || data;
            const token = responseData.token || responseData.accessToken || responseData.access_token || responseData.Token;

            if (token) {
                await AsyncStorage.setItem('token', token);
            }

            // A helper to find role in nested response
            const findRoleInObject = (obj) => {
                if (!obj) return null;

                // 1. Ưu tiên các trường Tên vai trò (String) hoặc Đối tượng vai trò (Object)
                const nameKeys = ['roleName', 'role_name', 'RoleName', 'role'];
                for (const key of nameKeys) {
                    const val = obj[key];
                    if (val && (typeof val === 'object' || (typeof val === 'string' && isNaN(val)))) return val;
                }

                // 2. Tìm sâu trong user hoặc data
                if (obj.user) return findRoleInObject(obj.user);
                if (obj.data && obj.data !== obj) return findRoleInObject(obj.data);

                // 3. Cuối cùng mới lấy ID đơn thuần
                return obj.roleId || obj.role_id || obj.role || obj.Role;
            };

            let roleRaw = findRoleInObject(responseData);

            // CRITICAL FALLBACK: If login SUCCESS but NO ROLE found, fetch from /users/me
            if (!roleRaw && token) {
                try {
                    console.log('[AUTH] Role not found in login response, fetching profile for verification...');
                    const profileRes = await userApi.getCurrentUser();
                    const profileData = profileRes.data || profileRes;
                    roleRaw = findRoleInObject(profileData);
                    console.log('[AUTH] Profile fetch result role:', JSON.stringify(roleRaw));
                } catch (profileError) {
                    console.error('[AUTH] Failed to fetch profile after login:', profileError);
                }
            }

            // Normalization thông minh - Ưu tiên Tên hơn ID
            const roleId = (typeof roleRaw === 'object') ? (roleRaw.id || roleRaw.roleId || 0) : roleRaw;
            const roleName = String((typeof roleRaw === 'object') ? (roleRaw.name || roleRaw.code || '') : (roleRaw || '')).toLowerCase();

            console.log(`[AUTH] Normalizing login role -> ID: ${roleId}, Name: ${roleName}`);

            let userRoleFallback = 'Student';

            // Ưu tiên kiểm tra Tên trước
            if (roleName.includes('admin') || roleName.includes('quản trị')) {
                userRoleFallback = 'Admin';
            } else if (roleName.includes('teacher') || roleName.includes('giáo viên') || roleName.includes('giảng viên')) {
                userRoleFallback = 'Teacher';
            } else if (roleName.includes('manager') || roleName.includes('quản lý')) {
                userRoleFallback = 'Manager';
            } else if (roleName.includes('student') || roleName.includes('sinh viên') || roleName.includes('học viên')) {
                userRoleFallback = 'Student';
            }
            // Nếu tên không rõ ràng, mới dùng ID
            else {
                if (roleId == 1 || roleId === '1') userRoleFallback = 'Admin';
                else if (roleId == 3 || roleId === '3') userRoleFallback = 'Teacher';
                else if (roleId == 2 || roleId === '2') userRoleFallback = 'Manager';
                else if (roleId == 4 || roleId === '4') userRoleFallback = 'Student';
            }

            console.log('[AUTH] Login finalized role:', userRoleFallback, 'from raw:', JSON.stringify(roleRaw));
            onLoginSuccess(userRoleFallback, responseData);

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
            Alert.alert('Đăng nhập thất bại', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center px-8">
            <View className="mb-10 w-full items-center">
                <View className="flex-row items-center mb-6">
                    <GraduationCap size={44} color="#1d4ed8" />
                    <View className="ml-3">
                        <Text className="text-2xl font-black text-[#0f172a]">EDU-AI Classroom</Text>
                        <Text className="text-sm text-gray-500 font-medium mt-0.5">Học tập đơn giản hơn</Text>
                    </View>
                </View>
                <Text className="text-gray-500 text-sm">Đăng nhập để tiếp tục sử dụng hệ thống</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-700 font-medium mb-1.5 ml-1">Tài khoản</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-12 bg-gray-50 focus:border-primary">
                        <User size={20} color="#9ca3af" />
                        <TextInput
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-gray-700 font-medium mb-1.5 ml-1">Mật khẩu</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-12 bg-gray-50 focus:border-primary">
                        <Lock size={20} color="#9ca3af" />
                        <TextInput
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    className="mt-2 items-end"
                >
                    <Text className="text-primary font-medium">Quên mật khẩu?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className={cn(
                        "h-12 bg-primary rounded-xl justify-center items-center mt-4 shadow-md shadow-blue-500/30",
                        loading && "opacity-70"
                    )}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Đăng nhập</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
