import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BookOpen, Clock, CheckCircle, ArrowRight, Calendar, Star, TrendingUp, Bell } from 'lucide-react-native';
import { Card } from '../../../components/Card';
import { ProgressBar } from '../../../components/ProgressBar';
import { userApi } from '../../profile/api/user-api';

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
    const [userName, setUserName] = useState('...');

    useEffect(() => {
        const loadName = async () => {
            try {
                const res = await userApi.getCurrentUser();
                const user = res.data?.data || res.data || res;
                setUserName(user.profile?.fullName || user.fullName || user.username || 'Học viên');
            } catch (err) {
                console.error("Lỗi lấy tên user db", err);
                setUserName('Học viên');
            }
        }
        loadName();
    }, []);

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-6" contentContainerStyle={{ paddingBottom: 60 }}>
            <View className="space-y-8">
                {/* Welcome Header */}
                <View className="mb-2 pr-4">
                    <Text className="text-xl font-black text-gray-800" numberOfLines={1}>
                        Chào quay trở lại,
                    </Text>
                    <Text className="text-xl font-black text-blue-600 mt-1" numberOfLines={1}>
                        {userName} !
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {stats.map((item, idx) => (
                        <View key={idx} style={{ width: '48%' }} className="bg-white border border-gray-100 p-2.5 rounded-3xl shadow-sm shadow-gray-200/40 flex-col mb-4">
                            <View className="flex-row items-start mb-2">
                                <View className={`w-7 h-7 ${getIconBg(item.color)} rounded-lg items-center justify-center mr-1.5 shrink-0`}>
                                    <item.icon size={13} color={getIconColor(item.color)} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[7.2px] font-bold text-gray-400 tracking-tight uppercase" numberOfLines={2}>
                                        {item.label}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-1 justify-end px-0.5">
                                <Text className="text-[15px] font-black text-gray-800 mb-0.5" numberOfLines={1} adjustsFontSizeToFit>{item.value}</Text>
                                <Text className={`text-[8.5px] font-bold ${item.subColor}`} numberOfLines={1}>{item.subValue}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Simple Chart Visualization */}
                <View className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm shadow-gray-200/40">
                    <View className="flex-row justify-between items-start mb-5">
                        <View className="flex-row items-center flex-1 mr-2">
                            <View className="bg-blue-50 p-2 rounded-xl mr-2 shrink-0">
                                <TrendingUp size={14} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[14px] font-extrabold text-gray-900" numberOfLines={1}>
                                    Phân tích học tập
                                </Text>
                                <Text className="text-[8px] uppercase font-bold text-gray-400 tracking-tight" numberOfLines={1}>
                                    7 ngày qua
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-gray-50 px-2 py-1 rounded-full border border-gray-100 shrink-0">
                            <Text className="text-[9px] font-bold text-gray-600">Tuần này</Text>
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
                                    <Text className="text-[10px] font-bold text-gray-400">{d.day}</Text>
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
                            <View key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex-row items-center">
                                <View className={`w-1 h-full rounded-full ${item.color} mr-4 shrink-0`}></View>
                                <View className="flex-1 mr-2">
                                    <Text className="text-[13px] font-extrabold text-gray-800 mb-1" numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text className="text-[10px] text-gray-500 font-medium" numberOfLines={1}>
                                        {item.course}
                                    </Text>
                                </View>
                                <View className="items-end shrink-0">
                                    <View className="flex-row items-center bg-white border border-gray-100 px-2 py-1 rounded-md">
                                        <Clock size={10} color="#9ca3af" className="mr-1" />
                                        <Text className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                                            {item.date.split(',')[0]}
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
