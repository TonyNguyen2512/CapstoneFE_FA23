// OLD
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";


const retrieveDataSuccessCode = 300;
const createSuccessCode = 302;
const updateSuccessCode = 303;
const deleteSuccessCode = 304;
const updateStatusSuccessCode = 305;

const errorComposer = (error) => {
	if (error?.response?.data) {
		const { code } = error?.response?.data
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

const resource = "Group";

const getAllUserByGroupId = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllUserByGroupId/${id}`);
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error GetAllUserByGroupId class: ", error);
		return errorComposer(error);
	}
};

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
			return successComposer(retrieveDataSuccessCode, response.data);;
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return errorComposer(error);
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
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get group: ", error);
		return errorComposer(error);
	}
};

const getAllUserNotInGroupId = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAllUserNotInGroupId/${id}`);
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error GetAllUserNotInGroupId class: ", error);
		return errorComposer(error);
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
			return successComposer(retrieveDataSuccessCode, response.data);
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return errorComposer(error);
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
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get group: ", error);
		return errorComposer(error);
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
			const response = await BaseApi.get(`/${resource}/GetAllWorkerNotYetGroup`, {
				params: params,
			});
			return successComposer(retrieveDataSuccessCode, response.data);
		}
	} catch (error) {
		console.log("Error enroll group: ", error);
		return errorComposer(error);
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
		const response = await BaseApi.get(`/${resource}/GetAllWorkerNotYetGroup`, {
			params: params,
		});
		return successComposer(retrieveDataSuccessCode, response.data);
	} catch (error) {
		console.log("Error get group: ", error);
		return errorComposer(error);
	}
};

const createGroup = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create`, data);
		return successComposer(createSuccessCode);
	} catch (error) {
		console.log("Error create item: ", error);
		return errorComposer(error);
	}
};

const updateGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/Update`, data);
		return successComposer(updateSuccessCode);
	} catch (error) {
		console.log("Error update item: ", error);
		return errorComposer(error);
	}
}

const addLeaderToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddLeaderToGroup`, data);
		return successComposer(updateSuccessCode);
	} catch (error) {
		console.log("Error update item: ", error);
		return errorComposer(error);
	}
}
const addWorkerToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddWorkerToGroup`, data);
		return successComposer(updateSuccessCode);
	} catch (error) {
		console.log("Error update item: ", error);
		return errorComposer(error);
	}
}
const removeWorkerFromGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/RemoveWorkerFromGroup`, data);
		
		return successComposer(deleteSuccessCode, response.data);
	} catch (error) {
		console.log("Error update item: ", error);
		return errorComposer(error);
	}
}
const addWorkersToGroup = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/AddWorkersToGroup`, data);
		return successComposer(updateSuccessCode);
	} catch (error) {
		console.log("Error update item: ", error);
		return errorComposer(error);
	}
}

const deleteGroup = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
		return successComposer(deleteSuccessCode);
	} catch (error) {
		console.log("Error delete item: ", error);
		return errorComposer(error);
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
