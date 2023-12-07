import BaseApi from ".";

const resource = "Notification";

const getByUserLogin = async () => {
  try {
    const response = await BaseApi.get(`/${resource}/GetByUserLogin`);
    return response.data;
  } catch (error) {
    console.log("Error get notification by user login: ", error);
    return false;
  }
};

const markSeenById = async (id) => {
  try {
    const response = await BaseApi.put(`/${resource}/MarkSeenById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error mark seen by id notification: ", error);
    return false;
  }
};

const markAllSeen = async () => {
  try {
    const response = await BaseApi.put(`/${resource}/MarkAllSeen`);
    return response.data;
  } catch (error) {
    console.log("Error mark all seen notification: ", error);
    return false;
  }
};

const deleteById = async (id) => {
  try {
    const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error delete notification: ", error);
    return false;
  }
};

const NotificationApi = {
  getByUserLogin,
  markSeenById,
  markAllSeen,
  deleteById,
};

export default NotificationApi;
