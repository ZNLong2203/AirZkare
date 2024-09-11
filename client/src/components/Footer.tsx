import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md w-full">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">&copy; 2024 AirZkare. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
