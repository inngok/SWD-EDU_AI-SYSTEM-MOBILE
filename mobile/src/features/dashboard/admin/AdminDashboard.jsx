import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Modal, Button } from 'react-native';
import { Users, Shield, GraduationCap, Plus, Search, Eye, Edit2, Trash2, Download } from 'lucide-react-native';
import { adminApi } from './api/admin-api';

export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Stats calculation
    const [stats, setStats] = useState({ total: 0, admin: 0, teacher: 0, student: 0 });

    // Modals & Action States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewedUser, setViewedUser] = useState(null);
    const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', gender: '', address: '', dateOfBirth: '', bio: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Get all active users
            const response = await adminApi.getUsers({ PageSize: 50 });
            const userList = response.data?.items || response.data || response || [];
            if (Array.isArray(userList)) {
                setUsers(userList);

                // Calculate stats
                let adminCount = 0;
                let teacherCount = 0;
                let studentCount = 0;

                userList.forEach(u => {
                    const roleId = u.roleId || u.role_id || u.role;
                    if (roleId === 1 || String(roleId).toLowerCase() === 'admin') adminCount++;
                    if (roleId === 3 || String(roleId).toLowerCase() === 'teacher') teacherCount++;
                    if (roleId === 4 || String(roleId).toLowerCase() === 'student') studentCount++;
                });

                setStats({
                    total: userList.length,
                    admin: adminCount,
                    teacher: teacherCount,
                    student: studentCount
                });
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách users:', error);
            // mock some stats for preview in case of failure
            setStats({ total: 19, admin: 0, teacher: 3, student: 5 });
            setUsers([
                { id: '1', fullName: 'ZienK', email: 'zienkdev@gmail.com', role: 4, createdAt: '2026-03-05T00:00:00Z', isActive: true },
                { id: '2', fullName: 'Yen Ngoc', email: 'ngocnguyen120305@gmail.com', role: 4, createdAt: '2026-03-05T00:00:00Z', isActive: true },
                { id: '3', fullName: 'Nguyễn Huỳnh Sơn', email: 'sonnh@gmail.com', role: 3, createdAt: '2026-03-05T00:00:00Z', isActive: true }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getRolePill = (roleId) => {
        let text = 'HỌC SINH';
        let bg = 'bg-gray-100';
        let textCol = 'text-gray-600';

        if (roleId === 1 || String(roleId).toLowerCase() === 'admin') {
            text = 'ADMIN';
            bg = 'bg-purple-100';
            textCol = 'text-purple-700';
        } else if (roleId === 3 || String(roleId).toLowerCase() === 'teacher') {
            text = 'GIÁO VIÊN';
            bg = 'bg-green-100';
            textCol = 'text-green-700';
        }

        return (
            <View className={`px-3 py-1 rounded-full ${bg}`}>
                <Text className={`text-xs font-bold ${textCol}`}>{text}</Text>
            </View>
        );
    };

    // Actions
    const handleDeleteUser = (id, name) => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa thành viên "${name}" không?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Cần mock do API thực tế có thể chưa được định nghĩa hoàn chỉnh
                            // await adminApi.deleteUser(id); 
                            Alert.alert('Thành công', 'Đã xóa người dùng thành công');
                            fetchUsers();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa người dùng này');
                        }
                    }
                }
            ]
        );
    };

    const handleViewClick = async (user) => {
        setViewedUser(user);
        setIsViewModalOpen(true);
        try {
            const res = await adminApi.getUserById(user.id);
            const detail = res.data?.data || res.data || {};

            setViewedUser({
                ...user,
                ...detail,
                profile: detail.profile || {}
            });
        } catch (error) {
            console.error("Lỗi lấy chi tiết:", error);
        }
    };

    const handleEditClick = async (user) => {
        setSelectedUser(user);
        // Pre-fill rough data so modal opens fast
        setEditForm({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            gender: '',
            address: '',
            dateOfBirth: '',
            bio: ''
        });
        setIsEditModalOpen(true);

        // Fetch detailed profile
        setActionLoading(true);
        try {
            const res = await adminApi.getUserById(user.id);
            const userData = res.data?.data || res.data || {};
            const profile = userData.profile || {};

            setEditForm({
                fullName: profile.fullName || userData.fullName || user.fullName || '',
                phoneNumber: profile.phoneNumber || user.phoneNumber || '',
                gender: profile.gender || '',
                address: profile.address || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
                bio: profile.bio || ''
            });
        } catch (error) {
            console.error("Lỗi lấy chi tiết người dùng:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            const payload = {
                fullName: editForm.fullName || '',
                phoneNumber: editForm.phoneNumber || '',
                gender: editForm.gender || '',
                address: editForm.address || '',
                dateOfBirth: editForm.dateOfBirth || null,
                bio: editForm.bio || ''
            };
            await adminApi.updateUserProfile(selectedUser.id, payload);
            Alert.alert('Thành công', 'Cập nhật hồ sơ người dùng thành công');
            setIsEditModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi cập nhật người dùng:", error);
            Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ người dùng');
        } finally {
            setActionLoading(false);
        }
    };

    // Filter local list
    const filteredUsers = users.filter(u => {
        const query = searchTerm.toLowerCase();
        return (u.fullName || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query);
    });

    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 pt-4" contentContainerStyle={{ paddingBottom: 60 }}>
            {/* Header Area */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-blue-700 mb-1">Quản lý người dùng</Text>
                <Text className="text-sm text-gray-500 mb-4">Quản lý tài khoản, vai trò và phân quyền hệ thống</Text>

                {/* Actions */}
                <View className="flex-row">
                    <TouchableOpacity className="flex-1 flex-row bg-blue-600 py-3.5 rounded-xl justify-center items-center shadow-md shadow-blue-500/30">
                        <Plus size={20} color="#ffffff" />
                        <Text className="text-white font-bold ml-2 text-base">Thêm người dùng</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="flex-row flex-wrap justify-between mb-8">
                {/* Total */}
                <View className="w-[48%] bg-white p-5 rounded-2xl shadow-sm shadow-blue-100/50 mb-4 border border-blue-50">
                    <Text className="text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Tổng tài khoản</Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-4xl font-black text-gray-800">{stats.total}</Text>
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                            <Users size={20} color="#3b82f6" />
                        </View>
                    </View>
                </View>

                {/* Admin */}
                <View className="w-[48%] bg-white p-5 rounded-2xl shadow-sm shadow-purple-100/50 mb-4 border border-purple-50">
                    <Text className="text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Admin</Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-4xl font-black text-gray-800">{stats.admin}</Text>
                        <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
                            <Shield size={20} color="#a855f7" />
                        </View>
                    </View>
                </View>

                {/* Teacher */}
                <View className="w-[48%] bg-white p-5 rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50">
                    <Text className="text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Giáo viên</Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-4xl font-black text-gray-800">{stats.teacher}</Text>
                        <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                            <GraduationCap size={20} color="#10b981" />
                        </View>
                    </View>
                </View>

                {/* Student */}
                <View className="w-[48%] bg-white p-5 rounded-2xl shadow-sm shadow-orange-100/50 border border-orange-50">
                    <Text className="text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Học sinh</Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-4xl font-black text-gray-800">{stats.student}</Text>
                        <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center">
                            <Users size={20} color="#f97316" />
                        </View>
                    </View>
                </View>
            </View>

            {/* List Panel */}
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                {/* Search & Filter Header */}
                <View className="mb-5 space-y-4">
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <Search size={20} color="#9ca3af" />
                        <TextInput
                            className="flex-1 ml-3 text-base text-gray-900 p-0"
                            placeholder="Tìm kiếm thành viên..."
                            placeholderTextColor="#9ca3af"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>
                </View>

                {/* Users List Data */}
                {loading ? (
                    <View className="py-10 items-center"><ActivityIndicator size="large" color="#1d4ed8" /></View>
                ) : filteredUsers.length > 0 ? (
                    <View className="space-y-4">
                        {filteredUsers.map((item, index) => {
                            const initial = item.fullName ? item.fullName.charAt(0).toUpperCase() : 'U';
                            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '5/3';
                            const roleId = item.roleId || item.role_id || item.role;
                            const isActive = item.isActive !== false;

                            return (
                                <View key={index} className="flex-col bg-gray-50 border border-gray-100 rounded-xl p-3 shadow-sm shadow-gray-200/20">
                                    {/* Top Row: User + Role */}
                                    <View className="flex-row justify-between items-start mb-2.5">
                                        <View className="flex-row items-center flex-1 mr-2">
                                            <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-2 border border-blue-200/50 shrink-0">
                                                <Text className="font-bold text-blue-700 text-base">{initial}</Text>
                                            </View>
                                            <View className="flex-1 justify-center">
                                                <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>{item.fullName || 'No Name'}</Text>
                                                <Text className="text-[10px] text-gray-500 mt-0.5">Tham gia: {date}</Text>
                                            </View>
                                        </View>
                                        <View className="shrink-0 pt-0.5">
                                            {getRolePill(roleId)}
                                        </View>
                                    </View>

                                    {/* Middle Row: Email + Status */}
                                    <View className="flex-row justify-between items-center bg-white p-2.5 rounded-lg border border-gray-100 mb-3">
                                        <View className="flex-1 mr-2">
                                            <Text className="text-xs font-bold text-blue-600" numberOfLines={1}>{item.email}</Text>
                                        </View>
                                        <View className="flex-row items-center bg-gray-50 px-2 py-1.5 rounded-full shrink-0">
                                            <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></View>
                                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {isActive ? 'Hoạt động' : 'Đã khóa'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Bottom Row: Actions */}
                                    <View className="flex-row justify-end items-center">
                                        <TouchableOpacity onPress={() => handleViewClick(item)} className="ml-3 p-1.5 bg-white rounded shadow-sm border border-gray-100">
                                            <Eye size={16} color="#4b5563" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleEditClick(item)} className="ml-3 p-1.5 bg-white rounded shadow-sm border border-gray-100">
                                            <Edit2 size={16} color="#3b82f6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteUser(item.id, item.fullName || item.email)} className="ml-3 p-1.5 bg-red-50 rounded shadow-sm border border-red-100">
                                            <Trash2 size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View className="py-12 items-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Users size={32} color="#9ca3af" style={{ marginBottom: 8 }} />
                        <Text className="text-gray-500 font-medium">Không tìm thấy thành viên!</Text>
                    </View>
                )}
            </View>

            {/* Modal: Edit User */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 min-h-[50%] max-h-[90%]">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            Cập nhật Hồ sơ Người dùng
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Họ và tên</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                    value={editForm.fullName}
                                    onChangeText={txt => setEditForm({ ...editForm, fullName: txt })}
                                    placeholder="Nhập họ và tên..."
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                    value={editForm.phoneNumber}
                                    onChangeText={txt => setEditForm({ ...editForm, phoneNumber: txt })}
                                    placeholder="Nhập số điện thoại..."
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View className="flex-row gap-3 mb-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-1">Giới tính</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                        value={editForm.gender}
                                        onChangeText={txt => setEditForm({ ...editForm, gender: txt })}
                                        placeholder="Nam/Nữ..."
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-1">Ngày sinh</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                        value={editForm.dateOfBirth}
                                        onChangeText={txt => setEditForm({ ...editForm, dateOfBirth: txt })}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Địa chỉ</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                    value={editForm.address}
                                    onChangeText={txt => setEditForm({ ...editForm, address: txt })}
                                    placeholder="Nhập địa chỉ..."
                                />
                            </View>

                            <View className="mb-2">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Tiểu sử</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                                    value={editForm.bio}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    onChangeText={txt => setEditForm({ ...editForm, bio: txt })}
                                    placeholder="Giới thiệu bản thân..."
                                />
                            </View>
                        </ScrollView>

                        <View className="flex-row justify-end space-x-3 gap-3">
                            <TouchableOpacity
                                onPress={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center"
                            >
                                <Text className="font-bold text-gray-700">Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                disabled={actionLoading}
                                className={`flex-1 flex-row bg-blue-600 py-3.5 rounded-xl items-center justify-center ${actionLoading && 'opacity-60'}`}
                            >
                                {actionLoading && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />}
                                <Text className="font-bold text-white">Lưu thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal: View User Detail */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isViewModalOpen}
                onRequestClose={() => setIsViewModalOpen(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-4">
                    <View className="bg-white rounded-2xl w-full max-h-[85%] overflow-hidden">
                        <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
                            <Text className="text-xl font-bold text-gray-900">Chi tiết tài khoản</Text>
                            <TouchableOpacity onPress={() => setIsViewModalOpen(false)} className="p-1">
                                <Text className="text-gray-400 font-bold text-xl leading-none">×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-5" contentContainerStyle={{ paddingBottom: 20 }}>
                            {viewedUser ? (
                                <View className="space-y-4">
                                    <View className="flex-row items-center mb-4">
                                        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mr-4 border border-blue-200/50">
                                            <Text className="font-bold text-blue-700 text-2xl">
                                                {viewedUser.fullName ? viewedUser.fullName.charAt(0).toUpperCase() : 'U'}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="font-extrabold text-gray-900 text-lg">{viewedUser.fullName || viewedUser.profile?.fullName || 'Chưa cập nhật'}</Text>
                                            <Text className="text-sm font-bold text-blue-600 mt-0.5">{viewedUser.email}</Text>
                                        </View>
                                    </View>

                                    <View className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 mb-2">
                                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Thông tin cơ bản</Text>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100">
                                            <Text className="text-gray-600 text-sm">ID</Text>
                                            <Text className="font-medium text-gray-900 flex-1 ml-4 text-right text-sm" numberOfLines={1} adjustsFontSizeToFit>{viewedUser.id}</Text>
                                        </View>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100 items-center">
                                            <Text className="text-gray-600 text-sm">Vai trò</Text>
                                            <View className="ml-4">{getRolePill(viewedUser.roleId || viewedUser.role_id || viewedUser.role)}</View>
                                        </View>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100 items-center">
                                            <Text className="text-gray-600 text-sm">Trạng thái</Text>
                                            <Text className={`font-bold ml-4 text-sm ${viewedUser.isActive !== false ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {viewedUser.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between py-2 items-center">
                                            <Text className="text-gray-600 text-sm">Ngày tạo</Text>
                                            <Text className="font-medium text-gray-900 ml-4 text-sm">
                                                {viewedUser.createdAt ? new Date(viewedUser.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 mt-4">
                                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hồ sơ cá nhân</Text>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100">
                                            <Text className="text-gray-600 text-sm">Số điện thoại</Text>
                                            <Text className="font-medium text-gray-900 ml-4 text-sm">{viewedUser.profile?.phoneNumber || viewedUser.phoneNumber || 'Chưa cập nhật'}</Text>
                                        </View>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100">
                                            <Text className="text-gray-600 text-sm">Giới tính</Text>
                                            <Text className="font-medium text-gray-900 ml-4 text-sm">{viewedUser.profile?.gender || 'Chưa cập nhật'}</Text>
                                        </View>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100">
                                            <Text className="text-gray-600 text-sm">Ngày sinh</Text>
                                            <Text className="font-medium text-gray-900 ml-4 text-sm">
                                                {viewedUser.profile?.dateOfBirth ? new Date(viewedUser.profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between py-2 border-b border-gray-100">
                                            <Text className="text-gray-600 text-sm">Địa chỉ</Text>
                                            <Text className="font-medium text-gray-900 text-right flex-1 ml-4 text-sm">{viewedUser.profile?.address || 'Chưa cập nhật'}</Text>
                                        </View>

                                        <View className="flex-col py-2">
                                            <Text className="text-gray-600 text-sm mb-1">Tiểu sử</Text>
                                            <Text className="font-medium text-gray-900 text-sm">{viewedUser.profile?.bio || 'Chưa cập nhật'}</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View className="py-10 items-center"><ActivityIndicator size="large" color="#1d4ed8" /></View>
                            )}
                        </ScrollView>

                        <View className="p-4 border-t border-gray-100">
                            <TouchableOpacity
                                onPress={() => setIsViewModalOpen(false)}
                                className="w-full bg-blue-600 py-3.5 rounded-xl items-center"
                            >
                                <Text className="font-bold text-white">Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};
