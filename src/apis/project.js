// OLD
import BaseApi from ".";

const resource = "Projects";

const getProjects = async (classId, search) => {
	try {
		const queryParams = {
			searchName: search,
		};
		const response = await BaseApi.get(
			`/${resource}/GetAllProjects/${classId}`,
			{
				params: queryParams,
			}
		);
		return response.data;
	} catch (error) {
		console.log("Error get projects: ", error);
		return [];
	}
};

const getWorkingProjects = async (classId) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/GetWorkingProjects/${classId}`
		);
		return response.data;
	} catch (error) {
		console.log("Error get working projects: ", error);
		return [];
	}
};

const getProjectById = async (id) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetProjectByID/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error get project by id: ", error);
		return undefined;
	}
};

const createProject = async (data) => {
	try {
		const response = await BaseApi.post(`/${resource}/CreateProject`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error create project: ", error);
		return false;
	}
};

const updateProject = async (data) => {
	try {
		const response = await BaseApi.put(`/${resource}/UpdateProject`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error update project: ", error);
		return false;
	}
};

const deleteProject = async (id) => {
	try {
		const response = await BaseApi.delete(`/${resource}/DeleteProject/${id}`);
		return response.status === 200;
	} catch (error) {
		console.log("Error delete project: ", error);
		return false;
	}
};

const checkClassProjectStatus = async (classId) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/GetProjectsAndStatusByClassIDandUserID/${classId}`
		);
		return response.data;
	} catch (error) {
		console.log("Error checkClassProjectStatus: ", error);
		return undefined;
	}
};

const ProjectApi = {
	getProjects,
	getWorkingProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	checkClassProjectStatus,
};

export default ProjectApi;
