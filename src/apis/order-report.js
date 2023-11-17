import BaseApi from ".";

const resoure = "OrderReport";

const getAll = async (pageIndex, pageSize = 5, search = undefined) => {
  try {
    const response = await BaseApi.get(`/${resoure}/GetAll`, {
      params: {
        pageIndex,
        pageSize,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get reports: ", error);
  }
};

const getByForemanId = async (foremanId, pageIndex = 1, pageSize = 1, search = undefined) => {
  try {
    const response = await BaseApi.get(`/${resoure}/GetByForemanId/${foremanId}`, {
      params: {
        pageIndex,
        pageSize,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get report by id: ", error);
  }
};
const getReportById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resoure}`, {
      params: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get report by id: ", error);
  }
};

const OrderReportApi = {
  getAll,
  getByForemanId,
  getReportById,
};

export default OrderReportApi;
