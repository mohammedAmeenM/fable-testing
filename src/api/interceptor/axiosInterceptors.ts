import axios, {
    AxiosHeaders,
    InternalAxiosRequestConfig,
    AxiosResponse,
  } from "axios";
  

const URL = import.meta.env.VITE_API_URL;
  
  // Create an Axios instance
  const api = axios.create({
    baseURL: URL,
  });
  
  // Add a request interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        // Ensure headers is properly handled
        config.headers = config.headers || new AxiosHeaders();
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add a response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // Handle response error
      if (error.response?.status === 401) {
        console.error("Unauthorized! Redirecting to login...");    }
      return Promise.reject(error);
    }
  );
  
  export default api;