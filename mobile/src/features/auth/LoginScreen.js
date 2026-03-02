import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { authApi } from './api/auth-api';

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



            // Assuming data.role or data.data.role exists
            const userRole = data.role || (data.data && data.data.role) || 'Student';

            onLoginSuccess(userRole);

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
            <View className="mb-10 items-center">
                <Text className="text-3xl font-bold text-primary mb-2">EduSystem</Text>
                <Text className="text-gray-500">Đăng nhập để tiếp tục</Text>
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
