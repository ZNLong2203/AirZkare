import React from 'react';
import { FaPlane, FaUser, FaSignInAlt, FaTicketAlt } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-2xl font-bold">
          <FaPlane className="mr-2 text-yellow-400" />
          AirZkare
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="hover:text-yellow-400 transition-colors duration-300">
            Admin
          </Link>
          <Link href="/" className="hover:text-yellow-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/book" className="hover:text-yellow-400 transition-colors duration-300">
            Book Flight
          </Link>
          <Link href="/login" className="flex items-center hover:text-yellow-400 transition-colors duration-300">
            <FaSignInAlt className="mr-1" />
            Login
          </Link>
          <Link href="/register" className="flex items-center hover:text-yellow-400 transition-colors duration-300">
            <FaUser className="mr-1" />
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
