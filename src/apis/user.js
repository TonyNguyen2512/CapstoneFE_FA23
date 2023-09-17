import BaseApi from ".";

const resource = "Users";

export const searchUsers = async (keyword) => {
	try {
		const query = keyword ? `?search=${keyword}` : "";
		const response = await BaseApi.get(`/${resource}/SearchUser${query}`);
		return response.data;
	} catch (error) {
		console.log("Error search users: ", error);
		return [];
	}
};

export const getListTeacher = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetListTeacher`);
		return response.data;
	} catch (error) {
		console.log("Error get list teacherss: ", error);
		return [];
	}
};

const banUser = async (userId) => {
	try {
		const response = await BaseApi.put(`/Users/BanUser/${userId}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error ban user: ", error);
		return false;
	}
};

const unbanUser = async (userId) => {
	try {
		const response = await BaseApi.put(`/Users/UnbanUser/${userId}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error unban user: ", error);
		return false;
	}
};

const updateUserRole = async (userId, roleId) => {
	try {
		const response = await BaseApi.put(`/Users/UpdateUserRole`, {
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
	getListTeacher,
};

export default UserApi;
