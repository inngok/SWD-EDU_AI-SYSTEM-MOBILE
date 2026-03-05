import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { User, Mail, Shield, Phone, MapPin } from 'lucide-react-native';
import { userApi } from './api/user-api';

export const ProfileScreen = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userApi.getCurrentUser();
            const userData = data.data || data;
            setProfile(userData);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#1d4ed8" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-500">Không tìm thấy thông tin</Text>
            </View>
        );
    }

    // Convert role integer to display text
    const roleValue = profile.roleId || profile.role_id || profile.role;
    let roleText = 'Học viên';
    if (roleValue === 1 || String(roleValue).toLowerCase() === 'admin') roleText = 'Quản trị viên';

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="bg-white rounded-2xl p-6 shadow-sm shadow-gray-200/50 mb-6 items-center">
                <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-4">
                    <User size={48} color="#1d4ed8" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.profile?.fullName || profile.fullName || profile.username || 'Chưa cập nhật tên'}
                </Text>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 font-medium text-sm">{roleText}</Text>
                </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm shadow-gray-200/50 space-y-4">
                <Text className="text-lg font-bold text-gray-900 mb-2">Thông tin liên hệ</Text>

                <View className="flex-row items-center border-b border-gray-100 pb-3">
                    <View className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3">
                        <Mail size={20} color="#6b7280" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-500 mb-0.5">Email</Text>
                        <Text className="text-gray-900 font-medium">{profile.email || 'Không có'}</Text>
                    </View>
                </View>

                <View className="flex-row items-center border-b border-gray-100 pb-3">
                    <View className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3">
                        <Phone size={20} color="#6b7280" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-500 mb-0.5">Số điện thoại</Text>
                        <Text className="text-gray-900 font-medium">{profile.phone || profile.phoneNumber || 'Chưa cập nhật'}</Text>
                    </View>
                </View>

                <View className="flex-row items-center pb-1">
                    <View className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3">
                        <MapPin size={20} color="#6b7280" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-500 mb-0.5">Địa chỉ</Text>
                        <Text className="text-gray-900 font-medium">{profile.address || 'Chưa cập nhật'}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
