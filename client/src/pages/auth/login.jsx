import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import API from '@/constants/api';
import { useStateProvider } from '@/redux/StateContext';

const Login = () => {
  const router = useRouter();
  const [{}, dispatch] = useStateProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API.LOGIN}`, {
        email: email,
        password: password,
      });
      dispatch({
        type: "SET_USER_INFO",
        userInfo: response.data.metadata,
      })
      localStorage.setItem('token', response.data.metadata.token);
      localStorage.setItem('role', response.data.metadata.role);
      localStorage.setItem('expire', response.data.metadata.expire);
      router.push('/');
    } catch (error) {
      toast.error("Invalid email or password");
    }
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        <form className="space-y-6">
          <div className="relative">
            <MdEmail className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="text" 
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
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <Link href="/auth/register" className="text-blue-500 hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
