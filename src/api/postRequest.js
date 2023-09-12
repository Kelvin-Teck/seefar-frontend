import axios from "axios";

const API = axios.create({ baseURL: "https://glorious-blue-millipede.cyclic.app" });

export const getTimelinePosts = (id) => API.get(`/post/${id}/timeline`);
