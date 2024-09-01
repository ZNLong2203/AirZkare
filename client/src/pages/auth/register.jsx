import React from 'react';
import { FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

const Register = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Register</h2>

        <form className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;