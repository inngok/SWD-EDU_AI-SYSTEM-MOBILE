import axiosClient from '../../../../api/axios-client';

export const adminApi = {
    getUsers: (params) => {
        return axiosClient.get('/admin/users', { params });
    },
    createUser: (data) => {
        const payload = { ...data };
        // Role comes in as string or number, parse if needed depending on swagger
        // body {"email": "...", "password": "...", "fullName": "...", "role": 0}
        return axiosClient.post('/admin/users', payload);
    },
    getUserById: (id) => {
        return axiosClient.get(`/admin/users/${id}`);
    },
    deleteUser: (id) => {
        return axiosClient.delete(`/admin/users/${id}`);
    },
    updateUserProfile: (id, data) => {
        return axiosClient.put(`/admin/users/${id}/profile`, data);
    }
};
