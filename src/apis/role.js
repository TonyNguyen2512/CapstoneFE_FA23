import { roles } from "../constants/app";

const resource = "Role";

const getAllRoles = async () => {
	try {
		// const response = await BaseApi.get(`/${resource}/GetAllRoles`);
		// return response.data;
		return [
			{
				name: roles.ADMIN
			},
			{
				name: roles.FOREMAN
			},
			{
				name: roles.LEADER
			},
			{
				name: roles.WORKER
			},
		]
	} catch (error) {
		console.log("Error get all roles: ", error);
		return [];
	}
};

const RoleApi = { getAllRoles };

export default RoleApi;
