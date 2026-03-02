import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Shield, Users, Server, AlertTriangle } from 'lucide-react-native';
import { Card } from '../../../components/Card';

const systemStats = [
    { label: 'Tổng người dùng', value: '5,420', icon: Users, color: 'text-blue-600' },
    { label: 'Server Status', value: 'Online', icon: Server, color: 'text-green-600' },
    { label: 'Cảnh báo bảo mật', value: '0', icon: Shield, color: 'text-purple-600' },
    { label: 'Lỗi hệ thống', value: '2', icon: AlertTriangle, color: 'text-red-500' },
];

export const AdminDashboard = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Welcome */}
            <Card className="mb-6 bg-slate-800 border-slate-700">
                <Text className="text-2xl font-semibold text-white">Admin Console</Text>
                <Text className="text-sm text-slate-300 mt-1">Hệ thống hoạt động bình thường.</Text>
            </Card>

            {/* Stats */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                {systemStats.map((item, idx) => (
                    <Card key={idx} className="flex-1 min-w-[45%] p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <item.icon size={22} color="#374151" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">{item.value}</Text>
                        <Text className="text-xs text-gray-500">{item.label}</Text>
                    </Card>
                ))}
            </View>

            {/* System Logs */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">System Logs</Text>
            <Card>
                <View className="py-3 border-b border-gray-100">
                    <View className="flex-row justify-between">
                        <Text className="text-sm font-bold text-gray-800">[INFO] User Created</Text>
                        <Text className="text-xs text-gray-400">10:45 AM</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">New student account ID: #8821 created.</Text>
                </View>
                <View className="py-3 border-b border-gray-100">
                    <View className="flex-row justify-between">
                        <Text className="text-sm font-bold text-yellow-600">[WARN] High Latency</Text>
                        <Text className="text-xs text-gray-400">10:30 AM</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">API response time &gt; 500ms.</Text>
                </View>
                <View className="py-3">
                    <View className="flex-row justify-between">
                        <Text className="text-sm font-bold text-red-600">[ERR] Payment Failed</Text>
                        <Text className="text-xs text-gray-400">09:15 AM</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">Transaction #991 failed via Gateway.</Text>
                </View>
            </Card>

        </ScrollView>
    );
};
