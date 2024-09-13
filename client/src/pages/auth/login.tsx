import axios from 'axios';
import React, { useState, FormEvent, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import API from '@/constants/api';
import { getCookie } from '@/utils/getCookie';
import { useStateProvider } from '@/redux/StateContext';

const Login: React.FC = () => {
  const router = useRouter();
  const { dispatch } = useStateProvider();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const token: string | undefined = getCookie('token');
    const user_id: string | undefined = getCookie('user_id');
    if(token && user_id) {
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
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
      localStorage.setItem('user_id', response.data.metadata.user_id);
      localStorage.setItem('token', response.data.metadata.token);
      localStorage.setItem('expire', response.data.metadata.expire);
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = API.GOOGLE_AUTH;
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
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            Login
          </button>
        </form>

        <Button 
          className='w-full mt-4 h-12'
          onClick={handleGoogleLogin}
        >
          <Mail className="mr-2 h-4 w-4" /> Login with Email
        </Button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Dont have an account? <Link href="/auth/register" className="text-blue-500 hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
