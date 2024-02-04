const {apiRequest} = require(".");

export const CreateCourse = async (course) => apiRequest('post', '/api/courses/create-course', course);
export const GetAllCourses = async (filters) => apiRequest('post', '/api/courses/get-all-courses', filters);
export const EditCourse = async (course) => apiRequest('post', '/api/courses/edit-course', course);
export const DeleteCourse = async (id) => apiRequest('post', '/api/courses/delete-course', {_id : id});
export const GetCoursesByRole = async (userId) => apiRequest('post', '/api/courses/get-courses-by-role', {userId});
export const GetCourseById = async (id) => apiRequest('post', '/api/courses/get-course-by-id', {_id : id});
export const AddEducatorToCourse = async (data) => apiRequest('post', '/api/courses/add-educator', data);
export const AddStudentToCourse = async (data) => apiRequest('post', '/api/courses/add-student', data);

export const RemoveEducatorFromCourse = async (data) => apiRequest('post', '/api/courses/remove-educator', data);
export const RemoveStudentFromCourse = async (data) => apiRequest('post', '/api/courses/remove-student', data);
