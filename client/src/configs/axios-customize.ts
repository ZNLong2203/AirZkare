import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Khởi tạo Axios Instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2222/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi cookie trong request
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

// Xử lý hàng đợi sau khi refresh token hoàn tất
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Interceptor Request: Đính kèm accessToken vào mỗi yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if ((error.response?.status === 500 || error.response?.status === 401) && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log('[INFO] Refreshing Access Token...');
        const response = await axiosInstance.post('/auth/refresh-token');
        const { accessToken } = response.data;

        if (!accessToken) {
          throw new Error('No accessToken returned from refresh-token endpoint');
        }

        localStorage.setItem('token', accessToken);

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('[ERROR] Failed to refresh token:', err);
        processQueue(err, null);
        localStorage.removeItem('token');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
