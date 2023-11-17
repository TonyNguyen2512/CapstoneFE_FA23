import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "WorkerTask";

const retrieveDataSuccessCode = 300;
const createSuccessCode = 302;
const udpateSuccessCode = 303;
const deleteSuccessCode = 304;
const updateStatusSuccessCode = 305;

const errorComposer = (error) => {
	if (error.response.data) {
		const { code } = error.response.data
		return {
			code,
			message: ApiCodes[code],
		}
	}
	return {
		message: "Có lỗi xảy ra",
		code: -1
	};
}

const successComposer = (messageId, data) => {
	return {
		code: 0,
		message: ApiCodes[messageId],
		data: data?.data || data,
	}
}

const createWorkerTasks = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create`, data);
		return successComposer(createSuccessCode);
	} catch (error) {
		console.log("Error create Worker task: ", error);
		return errorComposer(error);
	}
};

const updateWorkerTasks = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return successComposer(udpateSuccessCode);
	} catch (error) {
		console.log("Error update Worker task: ", error);
		return errorComposer(error);
	}
};

const updateWorkerTasksStatus = async (WorkerTasksId, status) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateStatus/${WorkerTasksId}/{status}`);
		return successComposer(updateStatusSuccessCode);
	} catch (error) {
		console.log("Error update Worker task status: ", error);
		return errorComposer(error);
	}
};

const deleteWorkerTasks = async (WorkerTasksId) => {
	try {
		const response = await BaseApi.delete(`/${resource}/Delete/${WorkerTasksId}`);
		return successComposer(deleteSuccessCode);
	} catch (error) {
		console.log("Error delete Worker task: ", error);
		return errorComposer(error);
	}
};

const getWorkerTaskById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetById/${id}`);
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get Worker task by id: ", error);
		return errorComposer(error);
	}
};

const getWorkerTaskByLeaderTaskId = async (leaderTaskId, searchName, pageIndex, pageSize = 1000) => {
	try {
		var params = {};
		if (searchName) {
		  params = { ...params, searchName };
		}
		if (pageIndex) {
		  params = { ...params, pageIndex };
		}
		if (pageSize) {
		  params = { ...params, pageSize };
		}
		const response = await BaseApi.get(`/${resource}/GetAll/${leaderTaskId}`, {
			params:params
		});
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get Worker tasks by Worker id: ", error);
		return errorComposer(error);
	}
};

const WorkerTasksApi = {
	createWorkerTasks,
	updateWorkerTasks,
	updateWorkerTasksStatus,
	deleteWorkerTasks,
	getWorkerTaskById,
	getWorkerTaskByLeaderTaskId,
};

export default WorkerTasksApi;
