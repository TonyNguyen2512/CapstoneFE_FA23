// OLD
import BaseApi from ".";

const resource = "ManagerTask";
const task = "ManagerTask";

const createManagerTask = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create${task}`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create manager task: ", error);
		return false;
	}
};

const updateManagerTask = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update${task}`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update manager task: ", error);
		return false;
	}
};

const updateManagerTaskStatus = async (managerTaskId, status) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/UpdateTaskStatus/${managerTaskId}`,
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

const deleteManagerTask = async (managerTaskId) => {
	try {
		const response = await BaseApi.delete(`/${resource}/DeleteTask`, {
			params: {
				managerTaskId: managerTaskId,
			},
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error delete manager task: ", error);
		return false;
	}
};

const getAllManagerTasks = async (projectId) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllTask`, {
			params: {
				projectId: projectId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get all manager tasks: ", error);
		return [];
	}
};

const assignManagerTask = async (taskId, memberId) => {
	try {
		const response = await BaseApi.put(`/${resource}/AssignTask`, {
			taskId,
			memberId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error assign manager task: ", error);
		return false;
	}
};

const unAssignManagerTask = async (taskId, memberId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UnAssignTask`, {
			taskId,
			memberId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error un assign manager task: ", error);
		return false;
	}
};

const ManagerTaskApi = {
	createManagerTask,
	updateManagerTask,
	deleteManagerTask,
	getAllManagerTasks,
	assignManagerTask,
	unAssignManagerTask,
	updateManagerTaskStatus,
};

export default ManagerTaskApi;
