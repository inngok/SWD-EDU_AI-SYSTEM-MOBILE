import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BookOpen, Clock, CheckCircle, ArrowRight, Calendar, Star, TrendingUp, Bell } from 'lucide-react-native';
import { Card } from '../../../components/Card';
import { ProgressBar } from '../../../components/ProgressBar';

const stats = [
    { label: 'KHÓA HỌC ĐANG HỌC', value: '0', subValue: '+1 mới', subColor: 'text-blue-600', icon: BookOpen, color: 'blue' },
    { label: 'THỜI LƯỢNG HỌC', value: '18.5h', subValue: 'Tuần này', subColor: 'text-gray-400', icon: Clock, color: 'orange' },
    { label: 'HOÀN THÀNH', value: '85%', subValue: 'Mục tiêu tuần', subColor: 'text-gray-400', icon: CheckCircle, color: 'emerald' },
    { label: 'ĐIỂM TRUNG BÌNH', value: '8.4', subValue: 'Học kỳ này', subColor: 'text-gray-400', icon: Star, color: 'purple' },
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
        date: 'HÔM NAY, 14:00',
        color: 'bg-red-500'
    },
    {
        title: 'Nộp bài tập Python',
        course: 'Lập trình Python căn bản',
        date: 'NGÀY MAI, 23:59',
        color: 'bg-orange-400'
    },
];

const getIconColor = (colorStr) => {
    switch (colorStr) {
        case 'blue': return '#2563eb';
        case 'orange': return '#f97316';
        case 'emerald': return '#10b981';
        case 'purple': return '#8b5cf6';
        default: return '#2563eb';
    }
};

const getIconBg = (colorStr) => {
    switch (colorStr) {
        case 'blue': return 'bg-blue-50';
        case 'orange': return 'bg-orange-50';
        case 'emerald': return 'bg-emerald-50';
        case 'purple': return 'bg-purple-50';
        default: return 'bg-blue-50';
    }
};

export const StudentDashboard = () => {
    return (
        <ScrollView className="flex-1 bg-white px-5 pt-6" contentContainerStyle={{ paddingBottom: 60 }}>
            <View className="space-y-8">
                {/* Welcome Header */}
                <View className="mb-2">
                    <Text className="text-2xl font-black text-gray-800 mb-1">
                        Chào quay trở lại, <Text className="text-blue-600">Phạm Thu Hương</Text> ! 👋
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-5">
                    {stats.map((item, idx) => (
                        <View key={idx} className="w-[47%] bg-white border border-gray-100 p-4 rounded-3xl shadow-sm shadow-gray-200/40">
                            <View className="flex-row items-center mb-4">
                                <View className={`w-9 h-9 ${getIconBg(item.color)} rounded-xl items-center justify-center mr-2`}>
                                    <item.icon size={18} color={getIconColor(item.color)} />
                                </View>
                                <Text className="flex-1 text-[9px] font-bold text-gray-400 tracking-wider uppercase" numberOfLines={2}>
                                    {item.label}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-[22px] font-black text-gray-800 mb-0.5">{item.value}</Text>
                                <Text className={`text-[11px] font-bold ${item.subColor}`}>{item.subValue}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Simple Chart Visualization */}
                <View className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm shadow-gray-200/40">
                    <View className="flex-row justify-between items-start mb-6">
                        <View className="flex-row items-center">
                            <TrendingUp size={18} color="#3b82f6" className="mr-2" />
                            <View>
                                <Text className="text-base font-extrabold text-gray-900 mb-1">
                                    Phân tích học tập
                                </Text>
                                <Text className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                                    Thời gian tập trung trong 7 ngày qua
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 flex-row items-center">
                            <Text className="text-xs font-bold text-gray-600 mr-1">Tuần này</Text>
                        </TouchableOpacity>
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
                </View>

                {/* Upcoming Deadlines */}
                <View className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm shadow-gray-200/40">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Hạn sắp tới
                        </Text>
                        <TouchableOpacity className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center">
                            <Bell size={14} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-4">
                        {upcomingDeadlines.map((item, idx) => (
                            <View key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex-row">
                                <View className={`w-1 rounded-full ${item.color} mr-4`}></View>
                                <View className="flex-1">
                                    <Text className="text-sm font-extrabold text-gray-800 mb-1">
                                        {item.title}
                                    </Text>
                                    <Text className="text-[11px] text-gray-500 mb-2 font-medium">
                                        {item.course}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Clock size={10} color="#9ca3af" className="mr-1" />
                                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
