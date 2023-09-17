import { message } from "antd";
import BaseApi from ".";

const resoure = "Report";

const sendReport = async (data) => {
	try {
		const response = await BaseApi.post(`/${resoure}/SendReport`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error send report: ", error);
		message.error(error?.response?.data);
	}
};

const sendReportFeedback = async (data) => {
	try {
		const response = await BaseApi.post(`/${resoure}/SendReportFeedback`, data);
		return response.status === 200;
	} catch (error) {
		console.log("Error send report feedback: ", error);
		return false;
	}
};

const getReports = async (teamId) => {
	try {
		const response = await BaseApi.get(`/${resoure}/GetTeamReports`, {
			params: {
				teamId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get reports: ", error);
	}
};

const getReportById = async (reportId) => {
	try {
		const response = await BaseApi.get(`/${resoure}/GetTeamReportById`, {
			params: {
				reportId,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error get report by id: ", error);
	}
};

const ReportApi = {
	sendReport,
	getReports,
	getReportById,
	sendReportFeedback,
};

export default ReportApi;
