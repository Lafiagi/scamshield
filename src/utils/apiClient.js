import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export a function to update the wallet address
let currentWalletAddress = localStorage.getItem("wallet_address") || null;

export const setWalletAddress = (address) => {
  currentWalletAddress = address;
  if (address) {
    localStorage.setItem("wallet_address", address);
  } else {
    localStorage.removeItem("wallet_address");
  }
};

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (currentWalletAddress) {
      config.headers["X-Wallet-Address"] = currentWalletAddress;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor remains the same
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setWalletAddress(null);
      window.location.href = "/";
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
