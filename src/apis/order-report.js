import { message } from "antd";
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "OrderReport";

const retrieveDataSuccessCode = 300;
const createSuccessCode = 302;
const updateSuccessCode = 303;
const deleteSuccessCode = 304;
const updateStatusSuccessCode = 305;

const errorComposer = (error) => {
	if (error?.response?.data) {
		const { code } = error?.response?.data
		return {
			code,
			message: ApiCodes[code],
		}
	}
	return {
		message: "Có lỗi xảy ra",
		code: -1
	};
}

const successComposer = (messageId, data) => {
	return {
		code: 0,
		message: ApiCodes[messageId],
		data: data?.data || data,
	}
}

const getAll = async (pageIndex, pageSize = 5, search = undefined) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetAll`, {
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
    const response = await BaseApi.get(`/${resource}/GetByForemanId/${foremanId}`, {
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
    const response = await BaseApi.get(`/${resource}/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get order report by id: ", error);
    message.error("Lấy thông tin báo cáo thất bại");
  }
};

const updateOrderReport = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update order report: ", error);
    return false;
  }
};

const createOrderReport = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create order report: ", error);
    return false;
  }
};

const OrderReportApi = {
  getAll,
  getByForemanId,
  getOrderReportById,
  updateOrderReport,
  createOrderReport,
};

export default OrderReportApi;
