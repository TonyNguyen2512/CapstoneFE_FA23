// OLD
import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Group";

const createGroup = async (data) => {
	try {
	  const response = await BaseApi.post(`/${resource}/Create`, data);
	  return response.status === 200;
	} catch (error) {
	  console.log("Error create item: ", error);
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

//   const getAllUserbyGroupId = async (id, search, pageSize) => {
// 	try {
// 	  if (search) {
// 		return await searchItem(search, pageIndex, pageSize);
// 	  }
// 	  else {
  
// 		var params = {};
// 		if (pageIndex) {
// 		  params = { ...params, pageIndex };
// 		}
// 		if (pageSize) {
// 		  params = { ...params, pageSize };
// 		}
// 		const response = await BaseApi.get(`/${resource}/GetAllUserByGroupId/${id}`, {
// 		  params: params,
// 		});
// 		return response.data;
// 	  }
// 	} catch (error) {
// 	  console.log("Error enroll item: ", error);
// 	  return false;
// 	}
//   };

  const getAllUserNotInGroupId = async (id, search, pageIndex, pageSize) => {
	try {
	  if (search) {
		// return await searchItem(search, pageIndex, pageSize);
	  }
	  else {
  
		var params = {};
		if (pageIndex) {
		  params = { ...params, pageIndex };
		}
		if (pageSize) {
		  params = { ...params, pageSize };
		}
		const response = await BaseApi.get(`/${resource}/GetAllUserNotInGroupId/${id}`, {
		  params: params,
		});
		return response.data;
	  }
	} catch (error) {
	  console.log("Error enroll item: ", error);
	  return false;
	}
  };
  
  const getAllOrders = async (search, pageIndex, pageSize) => {
	try {
	  if (search) {
		// return await searchOrders(search, pageIndex, pageSize);
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
		return response.data;
	  }
	} catch (error) {
	  console.log("Error get items: ", error);
	  return false;
	}
  };

const GroupApi = {
	createGroup,
	updateItem,
	deleteItem,
	// getAllUserbyGroupId,
	getAllUserNotInGroupId,
	getAllOrders,
	
};

export default GroupApi;
