import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Semesters";

const getSemesters = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetSemesterList`);
		return response.data;
	} catch (error) {
		console.log("Error get semesters: ", error);
		return [];
	}
};
const getSemesterById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetSemester/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get semester by id: ", error);
		return undefined;
	}
};

const createSemester = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/CreateSemester`, data);
		return response.data;
	} catch (error) {
		console.log("Error create semester: ", error);
		if (error.response.data) {
			return error.response.data;
		}

		return {
			code: 99,
			message: "Có lỗi xảy ra",
		};
	}
};

const updateSemester = async (id, data) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/UpdateSemester/${id}`,
			data
		);
		return response.data;
	} catch (error) {
		console.log("Error update semester: ", error);
		if (error.response.data) {
			return error.response.data;
		}

		return {
			code: 99,
			message: "Có lỗi xảy ra",
		};
	}
};

const SemesterApi = {
	getSemesters,
	getSemesterById,
	updateSemester,
	createSemester,
};

export default SemesterApi;
