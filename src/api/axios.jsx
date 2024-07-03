import axios from "axios";

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",  // Change this to Backend API URL
  timeout: 1000,
  Headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // JWT_AUTH
    const token = localStorage.getItem("AUTH_JWT");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);



export default instance;
