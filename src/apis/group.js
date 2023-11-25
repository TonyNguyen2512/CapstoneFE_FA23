// OLD
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Group";

const getAllUserByGroupId = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllUserByGroupId/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error GetAllUserByGroupId class: ", error);
		return [];
	}
};

// const getWorkersByGroupId = async (id) => {
// 	try {
// 		const response = await BaseApi.get(`/${resource}/GetWorkersByGroupId/${id}`);
// 		return response.data;
// 	} catch (error) {
// 		console.log("Error GetWorkersByGroupId class: ", error);
// 		return [];
// 	}
// };

const getWorkersByGroupId = async (id, search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGetWorkersByGroupId(id, search, pageIndex, pageSize);
		}
		else {
			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetWorkersByGroupId/${id}`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGetWorkersByGroupId = async (id, search, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetWorkersByGroupId/${id}`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const getAllUserNotInGroupId = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllUserNotInGroupId/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error GetAllUserNotInGroupId class: ", error);
		return [];
	}
};

const getAll = async (search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGroup(search, pageIndex, pageSize);
		}
		else {

			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetAll`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGroup = async (search, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetAll`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const getAllWorkerNoYetGroup = async (search, pageIndex, pageSize) => {
	try {
		if (search) {
			return await searchGetAllWorkerNoYetGroup(search, pageIndex, pageSize);
		}
		else {

			var params = {};
			if (pageIndex) {
				params = { ...params, pageIndex };
			}
			if (pageSize) {
				params = { ...params, pageSize };
			}
			const response = await BaseApi.get(`/${resource}/GetAllWorkerNoYetGroup`, {
				params: params,
			});
			return response.data;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return false;
	}
};

const searchGetAllWorkerNoYetGroup = async (search, pageIndex, pageSize) => {
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
		const response = await BaseApi.get(`/${resource}/GetAllWorkerNoYetGroup`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.log("Error get group: ", error);
		return false;
	}
};

const createGroup = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create item: ", error);
		return false;
	}
};

const updateGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}

const addLeaderToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddLeaderToGroup`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}
const addWorkerToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddWorkerToGroup`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}
const removeWorkerFromGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/RemoveWorkerFromGroup`, data);
		
		return response.data;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}
const addWorkersToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddWorkersToGroup`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}

const deleteGroup = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error delete item: ", error);
		return false;
	}
};

const GroupApi = {
	getAllUserByGroupId,
	getAllUserNotInGroupId,
	getWorkersByGroupId,
	getAll,
	getAllWorkerNoYetGroup,
	createGroup,
	updateGroup,
	addLeaderToGroup,
	addWorkerToGroup,
	removeWorkerFromGroup,
	addWorkersToGroup,
	deleteGroup,
};

export default GroupApi;
