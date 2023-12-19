import BaseApi from ".";

const resource = "Dashboard";

const UserDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/UserDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const OrderDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const OrderByMonthDashboard = async (year) => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderByMonthDashboard`, { params: { year: year || new Date().getFullYear() } });
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};


const LeaderTaskDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/LeaderTaskDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const WorkerTaskDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/WorkerTaskDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const OrderAssignDashboardByForemanId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderAssignDashboardByForemanId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const LeaderTaskDashboardByLeaderId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/LeaderTaskDashboardByLeaderId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const WorkerTaskDashboardByLeaderId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/WorkerTaskDashboardByLeaderId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const DashboardApi = {
  UserDashboard,
  OrderDashboard,
  OrderByMonthDashboard,
  LeaderTaskDashboard,
  WorkerTaskDashboard,
  OrderAssignDashboardByForemanId,
  LeaderTaskDashboardByLeaderId,
  WorkerTaskDashboardByLeaderId
};

export default DashboardApi;
