import axiosClient from '../../../../api/axios-client';

export const teacherApi = {
    // Lấy danh sách lớp chủ nhiệm
    getHomeroomClasses: () => {
        return axiosClient.get('/teacher/classes/homeroom');
    },

    // Lấy danh sách học sinh trong lớp (dùng cho cả lớp chủ nhiệm và bộ môn)
    getClassStudents: (classId) => {
        return axiosClient.get(`/teacher/classes/${classId}/students`);
    },

    // Alias cho tương thích ngược
    getHomeroomStudents: (classId) => {
        return axiosClient.get(`/teacher/classes/${classId}/students`);
    },

    // Lấy danh sách mình là giáo viên bộ môn
    getTeacherClassSubjects: (teacherId) => {
        return axiosClient.get(`/manager/classes/teacher/${teacherId}/class-subjects`);
    }
};
