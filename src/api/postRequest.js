import API from "./index";

export const getTimelinePosts = (id, page = 1, limit = 10) => API.get(`/post/${id}/timeline?page=${page}&limit=${limit}`);
export const likePost = (id, userId) => API.put(`/post/${id}/like`, { userId: userId });
export const getTrends = () => API.get('/post/trends');
export const getExplorePosts = () => API.get('/post/explore');

