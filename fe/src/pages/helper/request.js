import axios from "axios";

export const AppConfig = {
  apiUrl: "http://localhost:8080", // backend nếu cần
};

// Axios instance cho các request admin (có baseURL)
export const requestAdmin = axios.create({
  baseURL: AppConfig.apiUrl,
});
export const requestClient = axios.create({
  baseURL: AppConfig.apiUrl,
});
// Axios instance cho request địa chỉ, KHÔNG đặt baseURL vì gọi thẳng API GHN
export const requestAdress = axios.create();

// Hàm lấy header Authorization (nếu cần)
export const getHeader = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const token = JSON.parse(userData).accessToken;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Thêm interceptor cho requestAdmin để tự động thêm token Authorization
requestAdmin.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const accessToken = JSON.parse(userData).accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
