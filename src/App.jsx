// src/App.jsx
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

import "./App.css";

function App() {
  const { connected } = useWallet();
  const [darkMode, setDarkMode] = useState(false);

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
            element={connected ? <ReportForm /> : <Navigate to="/" />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/dashboard"
            element={connected ? <Dashboard /> : <Navigate to="/" />}
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
