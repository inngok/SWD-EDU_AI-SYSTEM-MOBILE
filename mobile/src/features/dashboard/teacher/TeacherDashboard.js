import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Users, BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react-native';
import { Card } from '../../../components/Card';

const teacherStats = [
    { label: 'Lớp đang dạy', value: '3', icon: BookOpen },
    { label: 'Học sinh', value: '120', icon: Users },
    { label: 'Giờ dạy tuần này', value: '18h', icon: Clock },
    { label: 'Bài cần chấm', value: '15', icon: CheckCircle },
];

const upcomingClasses = [
    {
        className: 'CS101 - Nhập môn lập trình',
        time: '08:00 - 10:00',
        room: 'P.302',
        students: 40
    },
    {
        className: 'AI202 - Machine Learning',
        time: '13:00 - 15:00',
        room: 'Lab 2',
        students: 35
    }
];

export const TeacherDashboard = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Welcome */}
            <Card className="mb-6">
                <Text className="text-2xl font-semibold text-primary-dark">Chào, Giảng viên</Text>
                <Text className="text-sm text-gray-500 mt-1">Hôm nay bạn có 2 lớp học.</Text>
            </Card>

            {/* Stats */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                {teacherStats.map((item, idx) => (
                    <Card key={idx} className="flex-1 min-w-[45%] flex-row items-center gap-3 p-4">
                        <item.icon size={20} color="#0487e2" />
                        <View>
                            <Text className="text-xs text-gray-500">{item.label}</Text>
                            <Text className="text-lg font-semibold text-gray-900">{item.value}</Text>
                        </View>
                    </Card>
                ))}
            </View>

            {/* Schedule */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">Lịch dạy hôm nay</Text>
            <View className="space-y-4 mb-6">
                {upcomingClasses.map((cls, idx) => (
                    <Card key={idx} className="flex-row justify-between items-center">
                        <View>
                            <Text className="font-semibold text-gray-900 text-base">{cls.className}</Text>
                            <View className="flex-row items-center gap-2 mt-1">
                                <Clock size={14} color="#6b7280" />
                                <Text className="text-xs text-gray-500">{cls.time}</Text>
                                <Text className="text-xs text-gray-300">|</Text>
                                <Text className="text-xs text-gray-500">{cls.room}</Text>
                            </View>
                        </View>
                        <View className="items-end bg-blue-50 px-3 py-1 rounded-full">
                            <Text className="text-xs font-medium text-blue-600">{cls.students} HS</Text>
                        </View>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
};
