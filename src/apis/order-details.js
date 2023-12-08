import BaseApi from ".";

const resource = "OrderDetail";

// Order Section //

const getListByOrderId = async (id, search, pageIndex, pageSize = 1000) => {
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
    return response.data;
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};


const createOrderDetail = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateOrderDetail`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateOrderDetail = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateOrderDetail`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteOrderDetail = async (id) => {
  try {
    const response = await BaseApi.delete(`/${resource}/DeleteOrderDetail`, { params: { id: id } });
    return response.status === 200;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const OrderDetailApi = {
  getListByOrderId,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};

export default OrderDetailApi;
