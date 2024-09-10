import React, { useState, useEffect, useRef } from 'react';
import { FaPlane, FaUser, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md relative z-50">
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
          <Link href="/booking" className="hover:text-yellow-400 transition-colors duration-300">
            Book Flight
          </Link>
          {isLogin ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors duration-300"
              >
                <FaUser
                  className="text-black"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  <Link href="/user/profile" className="block px-4 py-2 hover:bg-gray-200">
                    Profile
                  </Link>
                  <Link href="/user/tickets" className="block px-4 py-2 hover:bg-gray-200">
                    My Tickets
                  </Link>
                  <Link href="/auth/logout" className="block px-4 py-2 hover:bg-gray-200">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="flex items-center hover:text-yellow-400 transition-colors duration-300">
                <FaSignInAlt className="mr-1" />
                Login
              </Link>
              <Link href="/auth/register" className="flex items-center hover:text-yellow-400 transition-colors duration-300">
                <FaUser className="mr-1" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;