import BaseApi from ".";

const resource = "Task";

const createTask = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/CreateTask`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create task: ", error);
		return false;
	}
};

const updateTask = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateTask`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update task: ", error);
		return false;
	}
};

const updateTaskStatus = async (taskId, status) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/UpdateTaskStatus/${taskId}`,
			{
				status,
			}
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error update task status: ", error);
		return false;
	}
};

const deleteTask = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resource}/DeleteTask`, {
			params: {
				taskId: id,
			},
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error delete task: ", error);
		return false;
	}
};

const getAllTasks = async (projectId) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllTask`, {
			params: {
				projectId: projectId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get all tasks: ", error);
		return [];
	}
};

const assignTask = async (taskId, memberId) => {
	try {
		const response = await BaseApi.put(`/${resource}/AssignTask`, {
			taskId,
			memberId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error assign task: ", error);
		return false;
	}
};

const unAssignTask = async (taskId, memberId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UnAssignTask`, {
			taskId,
			memberId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error un assign task: ", error);
		return false;
	}
};

const TaskApi = {
	createTask,
	updateTask,
	deleteTask,
	getAllTasks,
	assignTask,
	unAssignTask,
	updateTaskStatus,
};

export default TaskApi;
