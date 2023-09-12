import axios from "axios";

const API = axios.create({
  baseURL: "https://long-erin-clownfish-kilt.cyclic.app",
});

export const getTimelinePosts = (id) => API.get(`/post/${id}/timeline`);
