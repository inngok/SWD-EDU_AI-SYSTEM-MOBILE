import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react-native';
import { Card } from '../../../components/Card';

const managerStats = [
    { label: 'Tổng học viên', value: '2,543', icon: Users, trend: '+12%' },
    { label: 'Doanh thu tháng', value: '1.2B', icon: DollarSign, trend: '+5%' },
    { label: 'Giảng viên', value: '45', icon: Users, trend: '+0%' },
    { label: 'Tỉ lệ hài lòng', value: '4.8/5', icon: Activity, trend: '+0.2' },
];

export const ManagerDashboard = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Welcome */}
            <Card className="mb-6">
                <Text className="text-2xl font-semibold text-primary-dark">Dashboard Quản lý</Text>
                <Text className="text-sm text-gray-500 mt-1">Tổng quan hoạt động trung tâm.</Text>
            </Card>

            {/* Stats */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                {managerStats.map((item, idx) => (
                    <Card key={idx} className="flex-1 min-w-[45%] p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <item.icon size={20} color="#0487e2" />
                            <Text className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{item.trend}</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">{item.value}</Text>
                        <Text className="text-xs text-gray-500">{item.label}</Text>
                    </Card>
                ))}
            </View>

            {/* Recent Activity Section Placeholder */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</Text>
            <Card>
                <View className="py-4 border-b border-gray-100">
                    <Text className="text-sm font-medium text-gray-900">Đăng ký mới: Nguyễn Văn A</Text>
                    <Text className="text-xs text-gray-500 mt-1">Khóa học: Lập trình Web - 10 phút trước</Text>
                </View>
                <View className="py-4 border-b border-gray-100">
                    <Text className="text-sm font-medium text-gray-900">Thanh toán thành công</Text>
                    <Text className="text-xs text-gray-500 mt-1">Hóa đơn #12345 - 30 phút trước</Text>
                </View>
                <View className="py-4">
                    <Text className="text-sm font-medium text-gray-900">Cập nhật lịch học</Text>
                    <Text className="text-xs text-gray-500 mt-1">Lớp Python Căn bản - 1 giờ trước</Text>
                </View>
            </Card>

        </ScrollView>
    );
};
