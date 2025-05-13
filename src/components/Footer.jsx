import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">SUI ScamShield</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
            <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              FAQ
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/your-username/sui-scamshield" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/suiscamshield" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© {currentYear} SUI ScamShield. Built for the SUI Overflow 2025 Hackathon.</p>
          <p className="mt-1">Protecting the SUI ecosystem together.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;