import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ReportForm from "./pages/ReportForm";
import ReportDetails from "./pages/ReportDetails";
import SearchPage from "./pages/SearchPage";
import LandingPage from "./pages/LandingPage";
import { useWalletStore } from "./stores/walletStore";
import "./App.css";

function App() {
  const { connected, account } = useWallet();
  const { setWalletAddress, clearWallet, isConnected } = useWalletStore();
  const [darkMode, setDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle store hydration
  useEffect(() => {
    // Small delay to ensure store has hydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  // Sync wallet state with Suiet wallet
  useEffect(() => {
    if (!isHydrated) return;

    if (connected && account?.address) {
      setWalletAddress(account.address);
    } else {
      clearWallet();
    }
  }, [connected, account?.address, setWalletAddress, clearWallet, isHydrated]);

  useEffect(() => {
    // Check user preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/report"
            element={isConnected() ? <ReportForm /> : <Navigate to="/" />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/dashboard"
            element={isConnected() ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route path="/reports/:id" element={<ReportDetails />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
