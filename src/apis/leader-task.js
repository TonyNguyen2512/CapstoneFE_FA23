import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "LeaderTask";

const retrieveDataSuccessCode = 300;
const createSuccessCode = 302;
const udpateSuccessCode = 303;
const deleteSuccessCode = 304;
const updateStatusSuccessCode = 305;

const errorComposer = (error) => {
	if (error?.response?.data) {
		const { code } = error?.response?.data
		return {
			code,
			message: ApiCodes[code] || "Có lỗi xảy ra",
		}
	}
	return {
		code: -1,
		message: "Có lỗi xảy ra",
	};
}

const successComposer = (messageId, data) => {
	return {
		code: 0,
		message: ApiCodes[messageId],
		data: data,
	}
}

const createLeaderTasks = async (data) => {
	try {
		await BaseApi.post(`/${resource}/Create`, data);
		return successComposer(createSuccessCode);
	} catch (error) {
		console.log("Error create manager task: ", error);
		return errorComposer(error);
	}
};

const createAcceptanceTasks = async (data) => {
	try {
		await BaseApi.post(`/${resource}/CreateAcceptanceTask`, data);
		return successComposer(createSuccessCode);
	} catch (error) {
		console.log("Error create manager task: ", error);
		return errorComposer(error);
	}
};

const updateLeaderTasks = async (data) => {
	try {
		await BaseApi.put(`/${resource}/Update`, data);
		return successComposer(udpateSuccessCode);
	} catch (error) {
		console.log("Error update manager task: ", error);
		return errorComposer(error);
	}
};

const updateLeaderTasksStatus = async (leaderTasksId, status) => {
	try {
		await BaseApi.put(
			`/${resource}/UpdateStatus/${leaderTasksId}`,
			{
				status,
			}
		);
		return successComposer(updateStatusSuccessCode);
	} catch (error) {
		console.log("Error update manager task status: ", error);
		return errorComposer(error);
	}
};

const deleteLeaderTasks = async (leaderTasksId) => {
	try {
		await BaseApi.delete(`/${resource}/Delete/${leaderTasksId}`);
		return successComposer(deleteSuccessCode);
	} catch (error) {
		console.log("Error delete manager task: ", error);
		return errorComposer(error);
	}
};

const getAll = async (searchName, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetAll`, {
			params: params,
		});
		return response.status === 200 && successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get leader tasks by order id: ", error);
		return errorComposer(error);
	}
};

const getLeaderTaskByOrderId = async (orderId, search, pageIndex, pageSize) => {
	try {
		var params = {};
		if (search) {
		  params = { ...params, search };
		}
		if (pageIndex) {
		  params = { ...params, pageIndex };
		}
		if (pageSize) {
		  params = { ...params, pageSize };
		}
		console.log("params", params)
		const response = await BaseApi.get(`/${resource}/GetByOrderId/${orderId}`, {
			params: params,
		});
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get leader tasks by order id: ", error);
		return errorComposer(error);
	}
};

const getLeaderTaskById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetById/${id}`);
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get leader task by id: ", error);
		return errorComposer(error);
	}
};

const getLeaderTaskByLeaderId = async (leaderId, searchName, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetByLeaderId/${leaderId}`, {
			params: params,
		});
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get leader tasks by leader id: ", error);
		return errorComposer(error);
	}
};

const LeaderTasksApi = {
	getAll,
	getLeaderTaskByOrderId,
	getLeaderTaskById,
	getLeaderTaskByLeaderId,
	createLeaderTasks,
	createAcceptanceTasks,
	updateLeaderTasksStatus,
	updateLeaderTasks,
	deleteLeaderTasks,
};

export default LeaderTasksApi;
