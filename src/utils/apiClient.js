import axios from "axios";
import { useWalletStore } from "../stores/walletStore";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get wallet address from either store or localStorage
const getWalletAddress = () => {
  // First try to get from Zustand store
  const storeAddress = useWalletStore.getState().walletAddress;
  if (storeAddress) {
    return storeAddress;
  }

  // Fallback to localStorage if store hasn't hydrated yet
  return localStorage.getItem("wallet_address");
};

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const walletAddress = getWalletAddress();
    if (walletAddress) {
      config.headers["X-Wallet-Address"] = walletAddress;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useWalletStore.getState().clearWallet();
      window.location.href = "/";
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
