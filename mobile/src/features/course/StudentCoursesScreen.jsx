import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, SlidersHorizontal, User, Clock, Users, Star, BookOpen, ChevronRight } from 'lucide-react-native';

const mockCourses = [
    { id: 1, title: '10C01 - Toán học nâng cao', grade: 'Lớp 10', subject: 'Toán', type: 'Khám phá', teacher: 'Thầy Nguyễn Văn A', duration: '40h', students: 25, rating: '4.8' },
    { id: 2, title: '12A19 - Vật lý lý thuyết', grade: 'Lớp 12', subject: 'Vật lý', type: 'Thực hành', teacher: 'Cô Trần Thị B', duration: '35h', students: 18, rating: '4.9' },
    { id: 3, title: '11B18 - Hóa học hữu cơ', grade: 'Lớp 11', subject: 'Hóa học', type: 'Khám phá', teacher: 'Thầy Lê Văn C', duration: '42h', students: 30, rating: '4.7' },
];

export const StudentCoursesScreen = () => {
    const [activeTab, setActiveTab] = useState('explore');
    const [searchQuery, setSearchQuery] = useState('');

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-20 px-6">
            <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-6">
                <Search size={40} color="#2563eb" opacity={0.8} />
            </View>
            <Text className="text-xl font-bold text-slate-800 mb-2">Chưa tìm thấy khóa học</Text>
            <Text className="text-sm text-slate-500 text-center mb-8 px-4 leading-6">
                Thử thay đổi từ khóa hoặc bộ lọc để khám phá thêm nhiều bài giảng thú vị nhé.
            </Text>
            <TouchableOpacity
                onPress={() => setActiveTab('explore')}
                className="bg-blue-600 px-8 py-4 rounded-2xl shadow-sm shadow-blue-300"
            >
                <Text className="text-white font-bold text-base">Khám phá ngay</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCourseCard = (course) => (
        <View key={course.id} className="bg-white rounded-[24px] mb-6 shadow-sm shadow-slate-200/60 overflow-hidden">

            {/* Top Area - No Borders, Just Clean Spacing */}
            <View className="p-5 pb-3">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row gap-2 flex-wrap flex-1">
                        <View className="bg-blue-100/50 px-3 py-1.5 rounded-lg">
                            <Text className="text-blue-700 text-[10px] font-bold uppercase tracking-wider">{course.grade}</Text>
                        </View>
                        <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
                            <Text className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">{course.subject}</Text>
                        </View>
                    </View>
                    <View className="bg-orange-50 px-3 py-1.5 rounded-lg">
                        <Text className="text-orange-600 text-[10px] font-bold uppercase tracking-wider">{course.type}</Text>
                    </View>
                </View>

                {/* Title & Teacher */}
                <Text className="text-xl font-black text-slate-800 mb-2 leading-7" numberOfLines={2}>
                    {course.title}
                </Text>

                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3">
                        <User size={14} color="#2563eb" />
                    </View>
                    <Text className="text-sm font-semibold text-slate-500 flex-1" numberOfLines={1}>
                        {course.teacher}
                    </Text>
                </View>

                {/* Metrics Grid - Seamless, No inner borders */}
                <View className="flex-row bg-slate-50 rounded-2xl p-4 mb-4">
                    <View className="flex-1 items-center">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Thời lượng</Text>
                        <View className="flex-row items-center">
                            <Clock size={12} color="#2563eb" className="mr-1.5" />
                            <Text className="text-sm font-black text-slate-700">{course.duration}</Text>
                        </View>
                    </View>

                    <View className="flex-1 items-center">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Sĩ số</Text>
                        <View className="flex-row items-center">
                            <Users size={12} color="#2563eb" className="mr-1.5" />
                            <Text className="text-sm font-black text-slate-700">{course.students}</Text>
                        </View>
                    </View>

                    <View className="flex-1 items-center">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Đánh giá</Text>
                        <View className="flex-row items-center">
                            <Star size={12} color="#f59e0b" fill="#f59e0b" className="mr-1.5" />
                            <Text className="text-sm font-black text-slate-700">{course.rating}</Text>
                        </View>
                    </View>
                </View>

                {/* Primary Action Button - Signature Blue */}
                <TouchableOpacity className="w-full bg-blue-600 py-4 rounded-2xl flex-row justify-center items-center shadow-sm shadow-blue-200 active:bg-blue-700">
                    <Text className="text-white font-bold text-sm mr-2">Đăng ký học ngay</Text>
                    <ChevronRight size={16} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header Area */}
            <View className="px-5 pt-8 pb-4 bg-slate-50">
                <Text className="text-3xl font-black text-slate-900 mb-1">
                    Học tập <Text className="text-blue-600">& Khám phá</Text>
                </Text>
                <Text className="text-sm text-slate-500 mb-6 font-medium">
                    Lộ trình học tập thông minh dành cho bạn.
                </Text>

                {/* Switch Tabs - Floating Style */}
                <View className="flex-row bg-slate-200/50 p-1.5 rounded-[20px] mb-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('my_courses')}
                        className={`flex-1 py-3 rounded-2xl items-center ${activeTab === 'my_courses' ? 'bg-white shadow-sm shadow-slate-200' : ''}`}
                    >
                        <Text className={`text-sm font-bold ${activeTab === 'my_courses' ? 'text-blue-600' : 'text-slate-500'}`}>
                            Khóa học của mình
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('explore')}
                        className={`flex-1 py-3 rounded-2xl items-center ${activeTab === 'explore' ? 'bg-white shadow-sm shadow-slate-200' : ''}`}
                    >
                        <Text className={`text-sm font-bold ${activeTab === 'explore' ? 'text-blue-600' : 'text-slate-500'}`}>
                            Khám phá mới
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar - Clean, borderless look with soft background */}
                <View className="flex-row gap-3">
                    <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm shadow-slate-200/50">
                        <Search size={20} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-base text-slate-800 font-medium"
                            placeholder="Tìm môn học, giáo viên..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm shadow-slate-200/50">
                        <SlidersHorizontal size={22} color="#2563eb" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* List Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'my_courses'
                    ? renderEmptyState()
                    : mockCourses.map(renderCourseCard)}
            </ScrollView>
        </View>
    );
};