import BaseApi from ".";

const resource = "MaterialCategory";


const getAllMaterialCategory = async (search, pageIndex, pageSize) => {
  try {
    // if (search) {
    //   return await searchMaterialCategory(search, pageIndex, pageSize);
    // }
    // else {
    var params = {};
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }
    const response = await BaseApi.get(`/${resource}/GetAllMaterialCategory`, {
      params: params,
    });
    return response.data;
    // }
  } catch (error) {
    console.log("Error get item: ", error);
    return [];
  }
};

// const searchMaterialCategory = async (search, pageIndex, pageSize) => {
//   try {
//     var params = {};
//     if (search) {
//       params = { ...params, search };
//     }
//     if (pageIndex) {
//       params = { ...params, pageIndex };
//     }
//     if (pageSize) {
//       params = { ...params, pageSize };
//     }

//     const response = await BaseApi.post(`/${resource}/SearchMaterialCategory`, {
//       params: params,
//     });

//     return response.data;
//   } catch (error) {
//     console.log("Error search item: ", error);
//     return [];
//   }
// };

const getMaterialCategoryById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetMaterialCategoryById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createMaterialCategory = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateMaterialCategory`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateMaterialCategory = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateMaterialCategory`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteMaterialCategory = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/DeleteMaterialCategory/${id}`);
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
