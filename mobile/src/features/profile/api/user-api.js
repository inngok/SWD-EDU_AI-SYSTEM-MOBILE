import axiosClient from '../../../api/axios-client';

export const userApi = {
    getCurrentUser: () => {
        return axiosClient.get('/users/me');
    },
};
