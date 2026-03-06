import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Users, UserCircle2, ArrowLeft, GraduationCap } from 'lucide-react-native';
import { teacherApi } from './api/teacher-api';

const StudentItem = ({ item }) => (
    <View style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    }}>
        <View style={{
            width: 44,
            height: 44,
            backgroundColor: '#f8fafc',
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12
        }}>
            <UserCircle2 size={24} color="#94a3b8" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>{item.fullName || item.name || 'Học sinh'}</Text>
            <Text style={{ fontSize: 13, color: '#94a3b8' }}>{item.email || '—'}</Text>
        </View>
    </View>
);

export const ClassDetailScreen = ({ classData, onBack }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const classId = classData.id || classData.Id || classData.classId || classData.ClassId;
                console.log(`[DETAIL] Loading students for: ${classId}`);

                const response = await teacherApi.getClassStudents(classId);
                const data = response?.data?.data || response?.data || response || [];
                setStudents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('[DETAIL] Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [classData]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#059669',
                padding: 24,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32
            }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('[DETAIL] Back button pressed');
                        onBack();
                    }}
                    style={{
                        width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 22, alignItems: 'center', justifyContent: 'center',
                        marginBottom: 20
                    }}
                >
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>Chi tiết lớp</Text>
                        <Text style={{ color: 'white', fontSize: 26, fontWeight: '900' }}>{classData.name || classData.className}</Text>
                    </View>
                    <GraduationCap size={40} color="white" />
                </View>
            </View>

            {/* Simple Stats */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -24, gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 20, elevation: 4 }}>
                    <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}>MÔN HỌC</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginTop: 4 }}>{classData.subjectName || 'N/A'}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 20, elevation: 4 }}>
                    <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}>SĨ SỐ</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginTop: 4 }}>{loading ? '...' : students.length}</Text>
                </View>
            </View>

            <View style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 16 }}>Danh sách thành viên</Text>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#059669" />
                    </View>
                ) : (
                    <FlatList
                        data={students}
                        keyExtractor={(item, index) => String(item.id || item.Id || index)}
                        renderItem={({ item }) => <StudentItem item={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Users size={40} color="#cbd5e1" />
                                <Text style={{ marginTop: 12, color: '#94a3b8', fontWeight: 'bold' }}>Lớp trống</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};
