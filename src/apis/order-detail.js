import BaseApi from ".";

const resource = "OrderDetail";

const getOrderDetailById = async (orderId, pageIndex, pageSize) => {
  try {
    var params = {};
    if (orderId) {
      params = { ...params, orderId };
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
    
		console.log(response.data)
    return response.data;
  } catch (error) {
    console.log("Error get order detail by id: ", error);
    return false;
  }
};

const getAllTaskByOrderDetailId = async (orderDetailId) => {
  try {
    var params = {};
    if (orderDetailId) {
      params = { ...params, orderDetailId };
    }
    const response = await BaseApi.get(`/${resource}/GetAllTaskByOrderDetailId`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.log("Error get order detail by id: ", error);
    return false;
  }
};

const updateOrderDetail = async (orderDetail) => {
  try {
    const params = {
      id: orderDetail.id,
      quantity: orderDetail.quantity,
      price: orderDetail.price,
      description: orderDetail.description,
    }
    const response = await BaseApi.get(`/${resource}`, {
      params: params,
    });
    return response.status === 200;
  } catch (error) {
    console.log("Error update order detail: ", error);
    return false;
  }
};

const OrderDetailApi = {
  getOrderDetailById,
  updateOrderDetail,
  getAllTaskByOrderDetailId,
};

export default OrderDetailApi;