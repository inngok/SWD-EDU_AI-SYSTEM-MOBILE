import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Home, User, BookOpen, LogOut, X, Shield, GraduationCap } from 'lucide-react-native';
import { cn } from '../../lib/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export const Sidebar = ({ isOpen, onClose, activeTab, onNavigate, onLogout, userRole }) => {
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -SIDEBAR_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen]);

    if (!isOpen && slideAnim._value === -SIDEBAR_WIDTH) return null;

    const getMenuItems = () => {
        const role = userRole ? userRole.toLowerCase() : 'student';
        const items = [];

        if (role === 'admin') {
            items.push({ key: 'admin', label: 'Bảng điều khiển', icon: Shield });
        } else {
            items.push({ key: 'student', label: 'Bảng điều khiển', icon: Home });
        }

        return items;
    };

    const menuItems = getMenuItems();

    return (
        <View className="absolute inset-0 z-50 flex-1" pointerEvents={isOpen ? 'auto' : 'none'}>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    className="absolute inset-0 bg-black/50"
                    style={{ opacity: fadeAnim }}
                />
            </TouchableWithoutFeedback>

            {/* Sidebar Content */}
            <Animated.View
                style={{ transform: [{ translateX: slideAnim }] }}
                className="absolute left-0 top-0 bottom-0 bg-white w-[75%] shadow-xl flex-col"
            >
                <View className="p-6 border-b border-gray-100 flex-row justify-between items-center mt-8">
                    <View className="flex-row items-center">
                        <GraduationCap size={24} color="#1d4ed8" />
                        <Text className="text-lg font-black text-[#0f172a] ml-2">EDU-AI Classroom</Text>
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => {
                                onNavigate(item.key);
                                onClose();
                            }}
                            className={cn(
                                "flex-row items-center gap-3 p-3 rounded-xl",
                                activeTab === item.key ? "bg-primary/10" : "hover:bg-gray-50"
                            )}
                        >
                            <item.icon
                                size={20}
                                color={activeTab === item.key ? "#0487e2" : "#6b7280"}
                            />
                            <Text className={cn(
                                "font-medium",
                                activeTab === item.key ? "text-primary" : "text-gray-500"
                            )}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="p-4 border-t border-gray-100 mb-6">
                    <TouchableOpacity
                        onPress={() => {
                            onNavigate('profile');
                            onClose();
                        }}
                        className={cn(
                            "flex-row items-center gap-3 p-3 rounded-xl mb-2",
                            activeTab === 'profile' ? "bg-blue-600/10" : "hover:bg-gray-50"
                        )}
                    >
                        <User size={20} color={activeTab === 'profile' ? "#2563eb" : "#4b5563"} />
                        <Text className={cn(
                            "font-medium",
                            activeTab === 'profile' ? "text-blue-600 font-bold" : "text-gray-600"
                        )}>
                            Hồ sơ cá nhân
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onLogout}
                        className="flex-row items-center gap-3 p-3 rounded-xl"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="font-medium text-red-500">Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};
