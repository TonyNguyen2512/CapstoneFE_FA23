import { roles } from "../constants/app";

const resource = "Role";

const getAllRoles = async () => {
	try {
		// const response = await BaseApi.get(`/${resource}/GetAllRoles`);
		// return response.data;
		return [
			{
				id: "55a761bc-f922-48ae-fed8-08dbd7cc0c37",
				name: roles.ADMIN
			},
			{
				id: "d571b862-0b11-48bf-789a-08dbd80933d7",
				name: roles.FACTORY
			},
			{
				id: "49d97a61-dc6a-47e7-5b4d-08dbd8fefeb1",
				name: roles.MANAGER
			},
			{
				id: "e0acdcdf-704a-49c6-6aad-08dbe2a052a2",
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
