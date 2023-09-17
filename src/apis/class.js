import BaseApi from ".";

const resource = "Class";

const createClass = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/CreateClass`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create class: ", error);
		return false;
	}
};

const enrollClass = async (classId, enrollCode) => {
	try {
		const response = await BaseApi.post(`/${resource}/EnrollClass`, {
			classId,
			enrollCode,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error enroll class: ", error);
		return false;
	}
};

const searchClass = async (keyword, courseId, semesterId, teacherId) => {
	try {
		var params = {};
		if (keyword) {
			params = { ...params, searchText: keyword };
		}
		if (courseId) {
			params = { ...params, courseId };
		}
		if (semesterId) {
			params = { ...params, semesterId };
		}
		if (teacherId) {
			params = { ...params, teacherId };
		}

		const response = await BaseApi.get(`/${resource}/SearchClass`, {
			params: params,
		});

		return response.data;
	} catch (error) {
		console.log("Error search class: ", error);
		return [];
	}
};

const getClassById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetClassByID/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get class by id: ", error);
		return undefined;
	}
};

const getClassStudents = async (classId) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetUsersInClass`, {
			params: {
				classId: classId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get class students: ", error);
		return undefined;
	}
};

const deleteClass = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resource}/DeleteClass/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error delete class: ", error);
		return false;
	}
};

const getUserInClass = async (id) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/GetUsersInClass?classId=${id}`
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error get student in class: ", error);
		return false;
	}
};

const updateClass = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateClass`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update class: ", error);
		return false;
	}
};

const assignCourseToTeacher = async (userID, classID) => {
	try {
		const response = await BaseApi.post(`/${resource}/AssignClass`, {
			userID,
			classID,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error assign class: ", error);
		return false;
	}
};
const unassignCourseToTeacher = async (userID, classID) => {
	try {
		const response = await BaseApi.post(`/${resource}/UnassignClass`, {
			userID,
			classID,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error unassign class: ", error);
		return false;
	}
};

const getTeacherClassList = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetTeacherClassList`);
		return response.status === 200;
	} catch (error) {
		console.log("Error get list class by teacher: ", error);
		return false;
	}
};

const updateEnrollCode = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateEnrollCode`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update enroll code: ", error);
		return false;
	}
};

const updateTeamRegisterDeadline = async (data) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/UpdateTeamRegisterDeadline`,
			data
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error update enroll code: ", error);
		return false;
	}
};

const updateTeamReportDeadline = async (data) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/UpdateTeamReportDeadline`,
			data
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error update enroll code: ", error);
		return false;
	}
};

const ClassApi = {
	enrollClass,
	createClass,
	searchClass,
	getClassById,
	getClassStudents,
	deleteClass,
	getUserInClass,
	updateClass,
	assignCourseToTeacher,
	unassignCourseToTeacher,
	getTeacherClassList,
	updateEnrollCode,
	updateTeamRegisterDeadline,
	updateTeamReportDeadline,
};

export default ClassApi;
