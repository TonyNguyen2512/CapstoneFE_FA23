import BaseApi from ".";

const resource = "MaterialCategory";


const getAllMaterialCategory = async (search, pageIndex, pageSize) => {
  try {
    var params = {};
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }
    if (search) {
      params = { ...params, search };
    }
    const response = await BaseApi.get(`/${resource}/GetAll`, {
      params: params,
    });
    return response.data;
    // }
  } catch (error) {
    console.log("Error get item: ", error);
  }
};

const getMaterialCategoryById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createMaterialCategory = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateMaterialCategory = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteMaterialCategory = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/Delete/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const MaterialCategoryApi = {
  getAllMaterialCategory,
  getMaterialCategoryById,
  createMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
};

export default MaterialCategoryApi;
