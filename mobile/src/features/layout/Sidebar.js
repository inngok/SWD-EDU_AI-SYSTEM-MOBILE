import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Home, User, BookOpen, LogOut, X, Shield } from 'lucide-react-native';
import { cn } from '../../lib/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export const Sidebar = ({ isOpen, onClose, activeTab, onNavigate, onLogout }) => {
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

    // Based on the prompt, the app "returns the correct dashboard", meaning we might not even need to switch manually.
    // However, showing the current dashboard item is good UI. 
    // And for debugging/super-user, maybe showing others if applicable.
    // For now, I will keep all items but you might want to filter this based on role passed in.
    const menuItems = [
        { key: 'student', label: 'Student Dashboard', icon: Home },
        { key: 'teacher', label: 'Teacher Dashboard', icon: BookOpen },
        { key: 'manager', label: 'Manager Dashboard', icon: User },
        { key: 'admin', label: 'Admin Dashboard', icon: Shield },
    ];

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
                    <Text className="text-xl font-bold text-primary">EduSystem</Text>
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
