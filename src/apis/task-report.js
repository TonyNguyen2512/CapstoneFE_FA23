import BaseApi from ".";

const resource = "TaskReport";

// not implement
const getAllReport = async (search, pageIndex, pageSize) => {
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
      const response = await BaseApi.get(`/${resource}/GetAllReport`, {
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

    const response = await BaseApi.post(`/${resource}/SearchReport`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};
// -----

const sendReport = async (data) => {
  try {
    // {
    //   "managerTaskId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   "reportType": 0,
    //   "title": "string",
    //   "content": "string",
    //   "reportStatus": 0,
    //   "resource": [
    //     "string"
    //   ],
    //   "createdDate": "2023-10-20T02:32:58.604Z"
    // }
    const response = await BaseApi.post(`/${resource}/SendReport`, data);

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

const responseReport = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateReport`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const getProgressReportsByManagerId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetProgressReportsByManagerId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const getProblemReportsByManagerId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetProblemReportsByManagerId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const ReportApi = {
  getAllReport,
  searchReport,
  sendReport,
  getReportByReportId,
  responseReport,
  getProgressReportsByManagerId,
  getProblemReportsByManagerId
};

export default ReportApi;
