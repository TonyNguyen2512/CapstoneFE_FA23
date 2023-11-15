import BaseApi from ".";

const resource = "Item";

const getAllItem = async (search, pageIndex, pageSize) => {
  try {

    if (search) {
      return await searchItem(search, pageIndex, pageSize);
    }
    else {

      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetAll`, {
        params: params,
      });
      console.log("get all item", response.data)
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

    const response = await BaseApi.post(`/${resource}/SearchItem`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};

const getItemById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetItemById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createItem = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateItem`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateItem = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateItem`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/DeleteItem/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const ItemApi = {
  getAllItem,
  searchItem,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

export default ItemApi;
