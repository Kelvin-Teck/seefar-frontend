import axios from "axios";

const API = axios.create({ baseURL: "https://glorious-blue-millipede.cyclic.app" });

export const logIn = (FormData) => API.post('/auth/login', FormData);
export const signUp = (FormData) => API.post('/auth/register', FormData);