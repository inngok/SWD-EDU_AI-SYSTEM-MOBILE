import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'; // Removed unused SafeAreaView
import { BookOpen, Clock, CheckCircle, ArrowRight, Calendar } from 'lucide-react-native';
import { Card } from '../../../components/Card';
import { ProgressBar } from '../../../components/ProgressBar';

// Use data passed from parent or define it here if it was local to App.js
// For now I will copy the data from App.js to here to make it self-contained
const stats = [
    { label: 'Khóa học đang học', value: '4', icon: BookOpen },
    { label: 'Giờ học tuần này', value: '12.5h', icon: Clock },
    { label: 'Bài tập hoàn thành', value: '85%', icon: CheckCircle },
    { label: 'Điểm trung bình', value: '8.5', icon: CheckCircle },
];

const studyData = [
    { day: 'T2', hours: 1.5 },
    { day: 'T3', hours: 2 },
    { day: 'T4', hours: 1 },
    { day: 'T5', hours: 2.5 },
    { day: 'T6', hours: 1.8 },
    { day: 'T7', hours: 3 },
    { day: 'CN', hours: 2.2 },
];

const continueLearning = [
    {
        id: 1,
        title: 'Nhập môn Trí tuệ Nhân tạo',
        lesson: 'Neural Networks Basic',
        progress: 65,
        image:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        lastAccessed: '2 giờ trước',
    },
    {
        id: 2,
        title: 'Lập trình Python căn bản',
        lesson: 'Functions & Modules',
        progress: 42,
        image:
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1000',
        lastAccessed: '1 ngày trước',
    },
];

const upcomingDeadlines = [
    {
        title: 'Kiểm tra giữa kỳ AI',
        course: 'Nhập môn Trí tuệ Nhân tạo',
        date: 'Hôm nay, 14:00',
    },
    {
        title: 'Nộp bài tập Python',
        course: 'Lập trình Python căn bản',
        date: 'Ngày mai, 23:59',
    },
];

const ProgressItem = ({ label, value, percent }) => (
    <View>
        <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-gray-500">{label}</Text>
            <Text className="text-xs text-gray-900 font-medium">{value}</Text>
        </View>
        <ProgressBar percent={percent} className="bg-white/50" />
    </View>
);

export const StudentDashboard = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="space-y-8">
                {/* Welcome Header */}
                <Card className="flex-col gap-6">
                    <View>
                        <Text className="text-2xl font-semibold text-primary-dark">
                            Chào, Ngọc
                        </Text>
                        <Text className="text-sm text-gray-500 mt-2">
                            Bạn đã hoàn thành 85% mục tiêu tuần
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-2 px-5 py-4 rounded-xl bg-primary active:bg-primary-dark"
                    >
                        <Text className="text-white font-medium text-base">Vào học tiếp</Text>
                        <ArrowRight size={18} color="white" />
                    </TouchableOpacity>
                </Card>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-4">
                    {stats.map((item, idx) => (
                        <Card key={idx} className="w-[48%] flex-row items-center gap-3 p-4">
                            <item.icon size={22} color="#0487e2" />
                            <View className="flex-1">
                                <Text className="text-[10px] text-gray-500 mb-0.5" numberOfLines={1}>{item.label}</Text>
                                <Text className="text-lg font-semibold text-gray-900">
                                    {item.value}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Simple Chart Visualization (Bars) */}
                <Card className="p-6">
                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-lg font-bold text-gray-900">
                            Thời gian học tập
                        </Text>
                        <Text className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md">
                            7 ngày qua
                        </Text>
                    </View>

                    <View className="h-52 flex-row items-end justify-between px-2 gap-3">
                        {studyData.map((d, i) => {
                            const height = (d.hours / 3) * 100; // Max 3 hours => 100%
                            return (
                                <View key={i} className="items-center gap-3 flex-1">
                                    <View
                                        className="w-full bg-primary/20 rounded-t-md relative overflow-hidden"
                                        style={{ height: `${height}%` }}
                                    >
                                        <View className="absolute bottom-0 left-0 right-0 h-full bg-primary opacity-60" />
                                    </View>
                                    <Text className="text-xs text-gray-400">{d.day}</Text>
                                </View>
                            )
                        })}
                    </View>
                </Card>

                {/* Continue Learning */}
                <View className="space-y-6">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xl font-semibold text-gray-900">
                            Tiếp tục học
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-1">
                            <Text className="text-sm text-primary">Xem tất cả</Text>
                            <ArrowRight size={14} color="#0487e2" />
                        </TouchableOpacity>
                    </View>

                    {continueLearning.map((item) => (
                        <Card key={item.id} className="p-0 overflow-hidden shadow-md">
                            <Image
                                source={{ uri: item.image }}
                                className="w-full h-40"
                                resizeMode="cover"
                            />
                            <View className="p-5">
                                <Text className="font-semibold text-gray-900 mb-2 text-lg">
                                    {item.title}
                                </Text>
                                <Text className="text-sm text-gray-500 mb-6">
                                    {item.lesson}
                                </Text>

                                <View className="space-y-3">
                                    <View className="flex-row justify-between">
                                        <Text className="text-xs text-gray-400">{item.progress}% hoàn thành</Text>
                                        <Text className="text-xs text-gray-400">{item.lastAccessed}</Text>
                                    </View>
                                    <ProgressBar percent={item.progress} />
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Sidebar Content (Moved to bottom for Mobile) */}
                <View className="space-y-8">
                    {/* Schedule */}
                    <Card className="p-6">
                        <View className="flex-row items-center gap-3 mb-6">
                            <Calendar size={18} color="#0487e2" />
                            <Text className="font-semibold text-gray-900 text-base">Lịch sắp tới</Text>
                        </View>

                        <View className="space-y-5">
                            {upcomingDeadlines.map((item, idx) => (
                                <View key={idx} className={idx !== 0 ? "pt-4 border-t border-gray-100" : ""}>
                                    <Text className="text-base font-medium text-gray-900">
                                        {item.title}
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-1">
                                        {item.course}
                                    </Text>
                                    <Text className="text-sm text-primary mt-2 font-medium">
                                        {item.date}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Weekly Goal */}
                    <View className="bg-primary-light rounded-2xl p-6 border border-primary-border shadow-sm">
                        <Text className="font-semibold text-gray-900 mb-6 text-base">
                            Mục tiêu tuần
                        </Text>
                        <View className="space-y-6">
                            <ProgressItem label="Bài học" value="4 / 5" percent={80} />
                            <ProgressItem label="Thời gian học" value="12.5 / 15h" percent={83} />
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}
