import BaseApi from ".";

const resource = "OrderDetail";

// Order Section //

const getListByOrderId = async (id, search, pageIndex, pageSize) => {
  try {
    var params = {};
    if (id) {
      params = { ...params, orderId: id };
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
    const response = await BaseApi.get(`/${resource}/GetByOrderIdWithPaging`, {
      params: params,
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const OrderDetailApi = {
  getListByOrderId,
};

export default OrderDetailApi;
