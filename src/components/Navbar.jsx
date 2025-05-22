import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Menu, X, Shield, Sun, Moon, Search } from "lucide-react";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useWallet();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-500 dark:text-blue-400"
      : "text-gray-700 dark:text-gray-300";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ScamShield
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                "/search"
              )}`}
            >
              Search
            </Link>
            {connected && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/dashboard"
                  )}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/report"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/report"
                  )}`}
                >
                  Report Scam
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <ConnectButton />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link
              to="/search"
              className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                "/search"
              )}`}
              onClick={closeMenu}
            >
              Search
            </Link>
            {connected && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/dashboard"
                  )}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/report"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/report"
                  )}`}
                  onClick={closeMenu}
                >
                  Report Scam
                </Link>
                <Link
                  to="/verify"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/verify"
                  )}`}
                  onClick={closeMenu}
                >
                  Verify
                </Link>
                <Link
                  to="/profile"
                  className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                    "/profile"
                  )}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
