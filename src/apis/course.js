// OLD
import BaseApi from ".";

const resoure = "Courses";

const getCourseById = async (id) => {
	const response = await BaseApi.post(`/${resoure}/GetCourseByID/${id}`);
	return response;
};

const createCourse = async (course) => {
	try {
		const response = await BaseApi.post(`/${resoure}/CreateCourse`, course);
		return {
			success: response.status === 200,
			data: response.data,
		};
	} catch (error) {
		console.log("Error create course: ", error);
		return {
			success: false,
			data: error.response.data,
		};
	}
};

const deleteCourse = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resoure}/DeleteCourse/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error delete course: ", error);
		return false;
	}
};

const searchCourses = async (keyword) => {
	try {
		const query = keyword ? `?searchText=${keyword}` : "";
		const response = await BaseApi.get(`/${resoure}/SearchCourse${query}`);
		return response.data;
	} catch (error) {
		console.log("Error search course: ", error);
		return [];
	}
};

const updateCourse = async (data) => {
	try {
		const response = await BaseApi.put(`/${resoure}/UpdateCourse`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update course: ", error);
		return false;
	}
};

const CourseApi = {
	getCourseById,
	createCourse,
	deleteCourse,
	searchCourses,
	updateCourse,
};

export default CourseApi;
