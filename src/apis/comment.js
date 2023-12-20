import BaseApi from ".";
import ApiCodes from "../constants/apiCode";

const resource = "Comment";

const retrieveDataSuccessCode = 300;
const createSuccessCode = 302;
const updateSuccessCode = 303;
const deleteSuccessCode = 304;
const updateStatusSuccessCode = 305;

const errorComposer = (error) => {
  if (error?.response?.data) {
    const { code } = error?.response?.data
    return {
      code,
      message: ApiCodes[code] || "Có lỗi xảy ra",
    }
  }
  return {
    code: -1,
    message: "Có lỗi xảy ra",
  };
}

const successComposer = (messageId, data) => {
  return {
    code: 0,
    message: ApiCodes[messageId],
    data: data,
  }
}

const getCommentByWorkerTaskId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetByWorkerTaskId/${id}`);
    // return successComposer(retrieveDataSuccessCode, response.data);
    return successComposer(retrieveDataSuccessCode, response.data);
  } catch (error) {
    console.log("Error get comments: ", error);
    return errorComposer(error);
  }
};

const createComment = async (item) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, item);
    return response.data.data;
  } catch (error) {
    console.log("Error create comment: ", error);
    return errorComposer(error);
  }
};

const updateComment = async (item) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, item);
    return successComposer(updateSuccessCode, response.data.data);
  } catch (error) {
    console.log("Error update comment: ", error);
    return errorComposer(error);
  }
};

const deleteComment = async (id) => {
  try {
    const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
    return successComposer(deleteSuccessCode, response.data.data);
  } catch (error) {
    console.log("Error delete comment: ", error);
    return errorComposer(error);
  }
};

const CommentApi = { getCommentByWorkerTaskId, createComment, updateComment, deleteComment };

export default CommentApi;
