import BaseApi from ".";
import { mockAccounts } from "../__mocks__/accounts";

const resource = "User";

export const searchUsers = async (keyword) => {
	try {
		let params = {};
		if (keyword) {
			params = { ...params, keyword };
			const response = await BaseApi.get(`/${resource}`, { params: params });
			return response.data;
		}
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

export const getAll = async (keyword) => {
	try {
		if (!!keyword) {
			return searchUsers(keyword);
		}
		else {
			const response = await BaseApi.get(`/${resource}/GetAll`);
			return response.data.data;
		}
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
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


const createUser = async (role, user) => {
	try {
		const response = await BaseApi.post(`/${resource}/Create${role}`, user);
		return response.status === 200;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const banUser = async (id) => {
	try {
		const response = await BaseApi.put(`/${resource}/BanUser/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const unbanUser = async (id) => {
	try {
		const response = await BaseApi.put(`/${resource}/UnBanUser/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error unban user: ", error);
		return false;
	}
};

const updateUserRole = async (userId, roleId) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateRole`, {
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
	createUser,
	updateUserRole,
	getUserByEmail,
	getUserRole,
	getAll,
};

export default UserApi;
