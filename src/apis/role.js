import BaseApi from ".";
import { roles } from "../constants/app";

const resource = "User";

const getAllRoles = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetRole`);
		return response.data.data;
		return [
			{
				id: "55a761bc-f922-48ae-fed8-08dbd7cc0c37",
				name: roles.ADMIN
			},
			{
				name: roles.FOREMAN
			},
			{
				name: roles.LEADER
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
