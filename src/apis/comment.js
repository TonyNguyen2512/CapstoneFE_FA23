import BaseApi from ".";

const resource = "Comment";

const getCommentByWorkerTaskId = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetByWorkerTaskId/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get comments: ", error);
    return [];
  }
};

const createComment = async (item) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, item);
    return response.data.data;
  } catch (error) {
    console.log("Error create comment: ", error);
    return null;
  }
};

const updateComment = async (item) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, item);
    return response.data.data;
  } catch (error) {
    console.log("Error update comment: ", error);
    return null;
  }
};

const deleteComment = async (id) => {
  try {
    const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
    return response.data.data;
  } catch (error) {
    console.log("Error delete comment: ", error);
    return null;
  }
};

const CommentApi = { getCommentByWorkerTaskId, createComment, updateComment, deleteComment };

export default CommentApi;
