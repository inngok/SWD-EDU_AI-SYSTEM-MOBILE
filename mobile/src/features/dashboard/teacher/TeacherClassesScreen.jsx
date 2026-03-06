import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Users, ChevronRight, BookOpen } from 'lucide-react-native';
import { teacherApi } from './api/teacher-api';
import { ClassDetailScreen } from './ClassDetailScreen';

// --- COMPONENT RIÊNG ĐỂ FIX LỖI NHẤN ---
const ClassCard = ({ item, tab, onSelect }) => {
    const className = item.name || item.Name || item.className || 'Lớp học';
    const subText = tab === 'homeroom' ? 'Lớp chủ nhiệm' : (item.subjectName || 'Dạy bộ môn');

    return (
        <TouchableOpacity
            onPress={() => {
                console.log('[TOUCH] Selected class:', className);
                onSelect(item);
            }}
            activeOpacity={0.6}
            style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 24,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                elevation: 3
            }}
        >
            <View style={{
                width: 56, height: 56, backgroundColor: '#f0fdf4',
                borderRadius: 16, alignItems: 'center', justifyContent: 'center',
                marginRight: 16
            }}>
                <Users size={28} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }} numberOfLines={1}>
                    {className}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <BookOpen size={14} color="#10b981" />
                    <Text style={{ color: '#059669', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                        {subText}
                    </Text>
                </View>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>
    );
};

export const TeacherClassesScreen = ({ user }) => {
    const [activeSubTab, setActiveSubTab] = useState('homeroom');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedClassData, setSelectedClassData] = useState(null);

    // Lấy ID giáo viên cực kỳ chắc chắn
    const teacherId = user?.id || user?.Id || user?.user?.id || user?.user?.Id || user?.teacherId;

    const fetchClasses = async () => {
        try {
            console.log(`[LOG] Fetching ${activeSubTab} for teacher: ${teacherId}`);
            setLoading(true);

            let response;
            if (activeSubTab === 'homeroom') {
                response = await teacherApi.getHomeroomClasses();
            } else {
                if (!teacherId) {
                    console.log('[LOG] Missing teacherId for teaching tab');
                    setClasses([]);
                    setLoading(false);
                    return;
                }
                response = await teacherApi.getTeacherClassSubjects(teacherId);
            }

            const rawData = response?.data?.data || response?.data || response || [];
            const finalData = Array.isArray(rawData) ? rawData : [];
            console.log(`[LOG] Loaded ${finalData.length} classes`);
            setClasses(finalData);
        } catch (error) {
            console.error('[LOG] Error fetching classes:', error);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [activeSubTab, teacherId]);

    const handleSelectClass = (item) => {
        const id = item.id || item.Id || item.classId || item.ClassId;
        if (!id) {
            console.log('[LOG] Selected item has no ID:', item);
            Alert.alert('Lỗi', 'Lớp học này không có mã định danh (ID) hợp lệ');
            return;
        }
        console.log('[LOG] Opening detail view for:', id);
        setSelectedClassData(item);
    };

    // --- HIỂN THỊ CHI TIẾT ---
    if (selectedClassData) {
        return (
            <ClassDetailScreen
                classData={selectedClassData}
                onBack={() => setSelectedClassData(null)}
            />
        );
    }

    // --- HIỂN THỊ DANH SÁCH ---
    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 20 }}>
            <View style={{ marginBottom: 24, paddingVertical: 10 }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#1e293b' }}>Lớp học</Text>
                <Text style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Quản lý các lớp của bạn</Text>
            </View>

            {/* Tabs Điều hướng */}
            <View style={{
                flexDirection: 'row', backgroundColor: '#e2e8f0',
                padding: 4, borderRadius: 16, marginBottom: 24
            }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('[TAB] Switching to Homeroom');
                        setActiveSubTab('homeroom');
                    }}
                    activeOpacity={0.8}
                    style={{
                        flex: 1, paddingVertical: 14, borderRadius: 12,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: activeSubTab === 'homeroom' ? 'white' : 'transparent',
                        shadowColor: activeSubTab === 'homeroom' ? '#000' : 'transparent',
                        shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: activeSubTab === 'homeroom' ? '#059669' : '#64748b' }}>Chủ nhiệm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        console.log('[TAB] Switching to Subject');
                        setActiveSubTab('subject');
                    }}
                    activeOpacity={0.8}
                    style={{
                        flex: 1, paddingVertical: 14, borderRadius: 12,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: activeSubTab === 'subject' ? 'white' : 'transparent',
                        shadowColor: activeSubTab === 'subject' ? '#000' : 'transparent',
                        shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: activeSubTab === 'subject' ? '#059669' : '#64748b' }}>Giảng dạy</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#059669" />
                    <Text style={{ marginTop: 12, color: '#94a3b8' }}>Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={(item, index) => String(item.id || item.Id || index)}
                    renderItem={({ item }) => (
                        <ClassCard
                            item={item}
                            tab={activeSubTab}
                            onSelect={handleSelectClass}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 60, padding: 30, backgroundColor: 'white', borderRadius: 32 }}>
                            <Users size={64} color="#f1f5f9" />
                            <Text style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: 16, marginTop: 16 }}>
                                {activeSubTab === 'homeroom' ? 'Bạn chưa có lớp chủ nhiệm' : 'Bạn chưa có lớp giảng dạy'}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};
