import BaseApi from ".";

const resource = "Item";

const getAllItem = async (search, pageIndex, pageSize) => {
  try {
    if (search) {
      return await searchItem(search, pageIndex, pageSize);
    } else {
      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetAllWithSearchAndPaging`, {
        params: params,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error enroll item: ", error);
    return false;
  }
};

const searchItem = async (search, pageIndex, pageSize) => {
  try {
    var params = {};
    if (search) {
      params = { ...params, search };
    }
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }
    const response = await BaseApi.get(`/${resource}/GetAllWithSearchAndPaging`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.log("Error get item: ", error);
    return false;
  }
};

const getItemById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createItem = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const duplicateItem = async (id, number) => {
  try {
    const response = await BaseApi.post(`/${resource}/DuplicateItem/${id}/${number}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error duplicate item: ", error);
    return false;
  }
};

const updateItem = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/Delete/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const ItemApi = {
  getAllItem,
  getItemById,
  createItem,
  duplicateItem,
  updateItem,
  deleteItem,
};

export default ItemApi;
