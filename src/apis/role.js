import BaseApi from ".";
import { roles } from "../constants/app";

const resource = "User";

const getAllRoles = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetRole`);
		return response.data.data;
	} catch (error) {
		console.log("Error get all roles: ", error);
		return [];
	}
};
const getRoleForCreateUser = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetRoleForCreateUser`);
		return response.data.data;
	} catch (error) {
		console.log("Error get member roles: ", error);
		return [];
	}
};

const RoleApi = { getAllRoles, getRoleForCreateUser };

export default RoleApi;
