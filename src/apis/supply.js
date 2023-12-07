import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Supply";

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

const getByOrderId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetByOrderId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};


const SupplyApi = {
    getByOrderId
};

export default SupplyApi;
