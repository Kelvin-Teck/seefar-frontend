import axios from "axios";

const API = axios.create({ baseURL: "https://long-erin-clownfish-kilt.cyclic.app" });

export const uploadImage = (data) => API.post('/upload/', data); 
export const uploadPost = (data) => API.post("/post", data); 

