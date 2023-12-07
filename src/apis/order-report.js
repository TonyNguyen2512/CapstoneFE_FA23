import { message } from "antd";
import BaseApi from ".";

const resoure = "OrderReport";

const getAll = async (pageIndex, pageSize = 5, search = undefined) => {
  try {
    const response = await BaseApi.get(`/${resoure}/GetAll`, {
      params: {
        pageIndex,
        pageSize,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get order reports: ", error);
    message.error("Lấy danh sách báo cáo thất bại");
  }
};

const getByForemanId = async (foremanId, pageIndex = 1, pageSize = 1, search = undefined) => {
  try {
    const response = await BaseApi.get(`/${resoure}/GetByForemanId/${foremanId}`, {
      params: {
        pageIndex,
        pageSize,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get order report by foreman id: ", error);
    message.error("Lấy danh sách báo cáo thất bại");
  }
};

const getOrderReportById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resoure}/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get order report by id: ", error);
    message.error("Lấy thông tin báo cáo thất bại");
  }
};

const updateOrderReport = async (data) => {
  try {
    const response = await BaseApi.put(`/${resoure}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update order report: ", error);
    return false;
  }
};

const OrderReportApi = {
  getAll,
  getByForemanId,
  getOrderReportById,
  updateOrderReport,
};

export default OrderReportApi;
