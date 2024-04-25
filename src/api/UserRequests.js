import axios from "axios";

const API = axios.create({ baseURL: "https://quickchat-backend-xlf9.onrender.com" });

const baseUrl = 'https://quickchat-backend-xlf9.onrender.com';

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });

export const getUser = (userId) => API.get(`/user/${userId}`);
export const updateUser = (id, formData) =>  API.put(`/user/${id}`, formData);

export const getAllUser = () => {
  return axios.get(`${baseUrl}/user`).then(({ data }) => {
      // console.log(data);
      return data;
  }).catch((error) => {
      console.log(error);
      throw error;
  });
};