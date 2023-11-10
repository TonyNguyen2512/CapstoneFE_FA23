// OLD
import BaseApi from ".";

const resource = "LeaderTask";

const createLeaderTasks = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create manager task: ", error);
		return false;
	}
};

const updateLeaderTasks = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update manager task: ", error);
		return false;
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
		return response.status === 200;
	} catch (error) {
		console.log("Error update manager task status: ", error);
		return false;
	}
};

const deleteLeaderTasks = async (leaderTasksId) => {
	try {
		const response = await BaseApi.delete(`/${resource}/Delete/${leaderTasksId}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error delete manager task: ", error);
		return false;
	}
};

const getLeaderTaskByOrderId = async (orderId, searchName, pageIndex, pageSize) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetByOrderId/${orderId}`, {
			searchName, pageIndex, pageSize
		});
		return response.data;
	} catch (error) {
		console.log("Error get leader tasks by order id: ", error);
		return [];
	}
};

const getLeaderTaskById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetById/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get leader task by id: ", error);
		return false;
	}
};

const getLeaderTaskByLeaderId = async (leaderId, searchName, pageIndex, pageSize) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetByLeaderId/${leaderId}`, {
			searchName, pageIndex, pageSize
		});
		return response.data;
	} catch (error) {
		console.log("Error get leader tasks by leader id: ", error);
		return [];
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
