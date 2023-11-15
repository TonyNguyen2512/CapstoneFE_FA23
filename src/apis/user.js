import BaseApi from ".";
import { mockAccounts } from "../__mocks__/accounts";

const resource = "User";

export const searchUsers = async (keyword) => {
	try {
		// const query = keyword ? `?search=${keyword}` : "";
		let params = {};
		if (keyword) params = { ...params, keyword };
		const response = await BaseApi.get(`/${resource}`, { params: params });
		return response.data;
		// return mockAccounts;
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

const getUserById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetById/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get user by id: ", error);
		return false;
	}
};

const getUserByRole = async (role) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetByRole/${role}`);
		return response.data;
	} catch (error) {
		console.log("Error get user by role: ", error);
		return false;
	}
};

const getAllUser = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetAll`);
		console.log("getAllUser", response.data)
		return response.data;
	} catch (error) {
		console.log("Error get user by role: ", error);
		return false;
	}
};

const getUserByEmail = async (email) => {
	try {
		const response = await BaseApi.get(`/${resource}/${email}`);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const getUserRole = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetUserRole/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const banUser = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/BanUser/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const unbanUser = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/UnbanUser/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error unban user: ", error);
		return false;
	}
};

const updateUserRole = async (userId, roleId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateUserRole`, {
			userId,
			roleId,
		});
		return response.status === 200;
	} catch (error) {
		console.log("Error update user role: ", error);
		return false;
	}
};

const UserApi = {
	searchUsers,
	banUser,
	unbanUser,
	updateUserRole,
	getUserById,
	getUserByRole,
	getAllUser,
};

export default UserApi;
