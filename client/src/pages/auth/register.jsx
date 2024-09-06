import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import API from '@/constants/api';

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API.REGISTER}`, {
        username: username,
        email: email,
        password: password,
      });
      router.push('/auth/login');
      toast.success("Register successful");
    } catch (error) {
      toast.error("Register failed");
    }
  }

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
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            onClick={handleRegister}
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
