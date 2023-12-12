import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "TaskReport";

const errorComposer = (error) => {
	if (error?.response?.data) {
		const { code } = error?.response?.data
		return {
			code,
			message: ApiCodes[code],
		}
	}
	return {
		code: -1,
		message: "Có lỗi xảy ra",
	};
}

const successComposer = (messageId, data) => {
	return {
		code: 0,
		message: ApiCodes[messageId],
		data: data?.data || data,
	}
}

// not implement
const getReportByLeaderId = async (search, pageIndex, pageSize) => {
  try {
    if (search) {
      return await searchReport(search, pageIndex, pageSize);
    }
    else {

      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetReportByLeaderId`, {
        params: params,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};
const searchReport = async (search, pageIndex, pageSize) => {
  try {
    var params = {};
    if (search) {
      params = { ...params, search };
    }
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }

    const response = await BaseApi.post(`/${resource}/GetReportByLeaderId`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};

const getReportByReportId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetReportByReportId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const updateReport = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};
const sendProgressReportFeedback = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/SendProgressReportFeedback`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};
const sendProblemReportFeedback = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/SendProblemReportFeedback`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};
const updateProblemTaskReport = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateProblemTaskReport`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const getProgressReportsByManagerId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetProgressReportsByLeaderTaskId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const getProblemReportsByManagerId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetProblemReportsByLeaderTaskId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createProgressReport = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateProgressReport`, data);
    return successComposer(response);
  } catch (error) {
    console.log("Error send progress report: ", error);
    return errorComposer(error);;
  }
};

const sendAcceptanceReport = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateAcceptanceReport`, data);
    return successComposer(response);
  } catch (error) {
    console.log("Error send acceptance report: ", error);
    return errorComposer(error);;
  }
};

const sendProblemReport = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateProblemReport`, data);
    return successComposer(response);
  } catch (error) {
    console.log("Error send problem report: ", error);
    return errorComposer(error);;
  }
};

const ReportApi = {
  getReportByLeaderId,
  searchReport,
  getReportByReportId,
  updateReport,
  getProgressReportsByManagerId,
  getProblemReportsByManagerId,
  sendAcceptanceReport,
  sendProblemReport,
  createProgressReport,
  sendProgressReportFeedback,
  sendProblemReportFeedback,
  updateProblemTaskReport
};

export default ReportApi;
