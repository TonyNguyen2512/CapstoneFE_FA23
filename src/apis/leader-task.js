import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "LeaderTask";

const retrieveDataSuccessCode = 300;
const createSuccessCode = 41;
const udpateSuccessCode = 99;
const updateStatusSuccessCode = 100;
const deleteSuccessCode = 101;

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
		data: data,
	}
}

const createLeaderTasks = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create`, data);
		return successComposer(createSuccessCode);
	} catch (error) {
		console.log("Error create manager task: ", error);
		return errorComposer(error);
	}
};

const updateLeaderTasks = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return successComposer(udpateSuccessCode);
	} catch (error) {
		console.log("Error update manager task: ", error);
		return errorComposer(error);
	}
};

const updateLeaderTasksStatus = async (leaderTasksId, status) => {
	try {
		const response = await BaseApi.put(
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
		const response = await BaseApi.delete(`/${resource}/Delete/${leaderTasksId}`);
		return successComposer(deleteSuccessCode);
	} catch (error) {
		console.log("Error delete manager task: ", error);
		return errorComposer(error);
	}
};

const getLeaderTaskByOrderId = async (orderId, searchName, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetByLeaderId/${leaderId}`, {
			searchName, pageIndex, pageSize
		});
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get leader tasks by leader id: ", error);
		return errorComposer(error);
	}
};

const LeaderTasksApi = {
	getLeaderTaskByOrderId,
	getLeaderTaskById,
	getLeaderTaskByLeaderId,
	createLeaderTasks,
	updateLeaderTasksStatus,
	updateLeaderTasks,
	deleteLeaderTasks,
};

export default LeaderTasksApi;
