// OLD
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Group";

const getAllUserByGroupId = async (id) => {
	try {
		const response = await BaseApi.post(
			`/${resource}/GetAllUserByGroupId/${id}`,
			{
				params: {
					classId: id,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log("Error search class: ", error);
		return [];
	}
};

const getAllUserNotInGroupId = async (id) => {
	try {
		const response = await BaseApi.post(
			`/${resource}/GetAllUserNotInGroupId/${id}`,
			{
				params: {
					classId: id,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log("Error search class: ", error);
		return [];
	}
};

const getAll = async (id) => {
	try {
		const response = await BaseApi.post(
			`/${resource}/GetAll/${id}`,
			{
				params: {
					classId: id,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log("Error search class: ", error);
		return [];
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
		return response.status === 200;
	} catch (error) {
		console.log("Error update item: ", error);
		return false;
	}
}

const deleteGroup = async (id) => {
	try {
	  const response = await BaseApi.get(`/${resource}/Delete/${id}`);
	  return response.status === 200;
	} catch (error) {
	  console.log("Error delete item: ", error);
	  return false;
	}
  };
  

const GroupApi = {
	getAllUserByGroupId,
	getAllUserNotInGroupId,
	getAll,
	createGroup,
	updateGroup,
	addLeaderToGroup,
	addWorkerToGroup,
	removeWorkerFromGroup,
	deleteGroup,
};

export default GroupApi;
