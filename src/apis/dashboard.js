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

const OrderByMonthDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};


const LeaderTaskDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderDashboard`);
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const WorkerTaskDashboard = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/OrderDashboard`);
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
};

export default DashboardApi;
