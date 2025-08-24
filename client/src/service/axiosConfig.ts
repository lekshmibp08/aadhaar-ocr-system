import axiosInstance from "axios";

const configAxios = axiosInstance.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default configAxios;