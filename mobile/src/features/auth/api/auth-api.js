import axiosClient from '../../../api/axios-client';

export const authApi = {
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },
};
