import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "OrderDetailMaterial";

const retrieveDataSuccessCode = 300;

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
		data: data,
	}
}

// Order Section //

const getByOrderDetailId = async (id, search, pageIndex, pageSize = 1000) => {
  try {
    var params = {};
    if (!id) {
      return errorComposer();
    }
    if (search) {
      params = { ...params, search };
    }
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }
    const response = await BaseApi.get(`/${resource}/GetByOrderDetailIdWidthPaging/${id}`, {
      params: params,
    });
    return successComposer(retrieveDataSuccessCode, response?.data);
  } catch (error) {
    console.log("Error get items: ", error);
    return errorComposer(error);;
  }
};

const OrderDetailMaterialApi = {
  getByOrderDetailId,
};

export default OrderDetailMaterialApi;
