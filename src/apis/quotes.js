import BaseApi from ".";

const resource = "Order";

const getAllQuotes = async (search, pageIndex, pageSize) => {
  try {
    if (search) {
      return await searchQuotes(search, pageIndex, pageSize);
    }
    else {

      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetQuotesByUserWithPaging`, {
        params: params,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const searchQuotes = async (search, pageIndex, pageSize = 1000) => {
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

    const response = await BaseApi.post(`/${resource}/SearchQuote`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};

const getQuoteById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const getQuoteMaterialByQuoteId = async (quoteId) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetQuoteMaterialById/${quoteId}`);
    return response.data;
  } catch (error) {
    console.log("Error get quote material by quote id: ", error);
    return undefined;
  }
}

const createQuote = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error create item: ", error);
    return error.response.data;
  }
};

const updateQuote = async (id, status) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateStatus/${status}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error update item: ", error);
    return error.response.data;
  }
};

const updateStatus = async (id, status) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateStatus/${status}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};
const deleteQuote = async (id) => {
  try {
    const success = await updateQuote(id, 5);
    return success;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const exportQuote = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/ExportQuoteAsPDF/${id}`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.log("Error export quote: ", error);
    return undefined;
  }
};

const QuoteApi = {
  getAllQuotes,
  searchQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  updateStatus,
  deleteQuote,
  getQuoteMaterialByQuoteId,
  exportQuote,
};

export default QuoteApi;
