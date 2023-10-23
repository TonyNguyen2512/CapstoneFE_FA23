// OLD
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "ProjectTeams";

const getProjectTeamRequests = async (classId) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetTeamProjectRequests`, {
			params: {
				classId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get project team requests: ", error);
		return [];
	}
};

const getTeamRequestById = async (id) => {
	try {
		const response = await BaseApi.post(
			`/${resource}/GetTeamProjectRequests?classId=${id}`,
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

const createTeamRequest = async (request) => {
	try {
		const response = await BaseApi.post(
			`/${resource}/StudentCreateTeamRequest`,
			request
		);
		return {
			success: response.status === 200,
			data: response.data,
		};
	} catch (error) {
		console.log("Error create team request: ", error);
		return {
			success: false,
			data: error.response.data,
		};
	}
};

const AcceptTeamRequest = async (teamId) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/AcceptTeamProjectrequest/${teamId}`,
			teamId
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error accept team request: ", error);
		return false;
	}
};

const DenyTeamRequest = async (teamId) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/DenyTeamProjectrequest/${teamId}`,
			teamId
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error deny team request: ", error);
		return false;
	}
};

const cancelTeamRequest = async (teamId) => {
	try {
		const response = await BaseApi.put(
			`/${resource}/CancelTeamProjectrequest/${teamId}`
		);
		return response.status === 200;
	} catch (error) {
		console.log("Error cancel team request: ", error);
		return false;
	}
};
const getProjectTeamInClass = async (classId) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/getProjectTeamInClass/${classId}`
		);
		return response.data;
	} catch (error) {
		console.log("Error getProjectTeamInClass: ", error);
		return [];
	}
};

const registerProjectTeam = async (request) => {
	try {
		await BaseApi.post(`/${resource}/RegisterTeam`, request);
		return {
			code: 0,
			message: "",
		};
	} catch (error) {
		console.log("Error register team: ", error);
		if (error.response.data) {
			const { code } = error.response.data;
			return {
				code,
				message: ApiCodes[code],
			};
		}
		return {
			message: "Có lỗi xảy ra",
			code: -1,
		};
	}
};

const getJoinedProjectTeams = async (classId) => {
	try {
		const response = await BaseApi.get(`/${resource}/GetJoinedProjectTeams`, {
			params: {
				classId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error getJoinedProjectTeams: ", error);
		return [];
	}
};

const getJoinedProjectTeamById = async (teamId) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/GetJoinedProjectTeamsById/${teamId}`
		);
		return response.data;
	} catch (error) {
		console.log("Error getJoinedProjectTeamById: ", error);
		return undefined;
	}
};

const getProjectTeamsByTeacher = async () => {
	try {
		const response = await BaseApi.get(`/${resource}/GetProjectTeamsByTeacher`);
		return response.data;
	} catch (error) {
		console.log("Error getProjectTeamsByTeacher: ", error);
		return [];
	}
};

const getProjectTeamDetailByTeacher = async (teamId) => {
	try {
		const response = await BaseApi.get(
			`/${resource}/GetProjectTeamByTeacher/${teamId}`
		);
		return response.data;
	} catch (error) {
		console.log("Error getProjectTeamDetailByTeacher: ", error);
		return [];
	}
};

const TeamApi = {
	getProjectTeamRequests,
	getTeamRequestById,
	createTeamRequest,
	AcceptTeamRequest,
	DenyTeamRequest,
	cancelTeamRequest,
	getProjectTeamInClass,
	registerProjectTeam,
	getJoinedProjectTeams,
	getJoinedProjectTeamById,
	getProjectTeamsByTeacher,
	getProjectTeamDetailByTeacher,
};

export default TeamApi;
