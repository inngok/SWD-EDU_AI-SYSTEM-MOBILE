import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BookOpen, Plus, Search } from 'lucide-react-native';

export const TeacherCoursesScreen = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-900 mb-1">Quản lý Khóa học</Text>
                <Text className="text-gray-500">Xem và quản lý các khóa học bạn đang giảng dạy</Text>
            </View>

            <TouchableOpacity className="bg-blue-600 p-4 rounded-2xl flex-row justify-center items-center mb-6 shadow-sm">
                <Plus size={20} color="white" />
                <Text className="text-white font-bold ml-2">Tạo khóa học mới</Text>
            </TouchableOpacity>

            <View className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 items-center justify-center">
                <BookOpen size={48} color="#9ca3af" className="mb-4" />
                <Text className="text-gray-500 font-medium text-center">Bạn chưa có khóa học nào. Hãy bắt đầu bằng cách tạo khóa học đầu tiên!</Text>
            </View>
        </ScrollView>
    );
};
