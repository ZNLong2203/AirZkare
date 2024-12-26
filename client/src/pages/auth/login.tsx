"use client";

import axios from "axios";
import React, { useState, FormEvent, useEffect } from "react";
import { FaLock, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Plane, CheckCircle2, Lock, Cloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import API from "@/constants/api";
import useFlightSearchStore from "@/store/useFlightSearchStore";
import { getCookie } from "@/utils/getCookie";
import { useStore } from "@/store/useStore";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login: React.FC = () => {
  const router = useRouter();
  const { setUserInfo, setToken } = useStore();
  const { isSearching } = useFlightSearchStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token: string | undefined = getCookie("token");
    const user_id: string | undefined = getCookie("user_id");
    if (token && user_id) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API.LOGIN}`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      setUserInfo(response.data.metadata);
      setToken(response.data.metadata.token, response.data.metadata.expire);

      localStorage.setItem("user_id", response.data.metadata.user_id);
      localStorage.setItem("token", response.data.metadata.accessToken);
      localStorage.setItem("expire", response.data.metadata.expire);

      if (isSearching) {
        router.push("/booking/passengerdetails");
      } else {
        router.push("/");
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = API.GOOGLE_AUTH;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left Section - Login Form */}
      <div className="relative flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-full">
              <div className="relative w-full max-w-[180px] aspect-[3/1]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* <Plane className="h-8 w-8 text-[#4169E1]" /> */}
                </div>
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#4169E1] ml-10">AirZkare</span>
                </div> */}
              </div>
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1a365d]">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500">
                Please sign in to your account to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white border-gray-200 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiFillEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#4169E1] hover:bg-[#3154b3] transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-b from-gray-50 to-gray-100 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-11 bg-white hover:bg-gray-50 border border-gray-200"
          >
            <FaGoogle className="mr-2 h-4 w-4 text-[#4169E1]" />
            Sign in with Google
          </Button>

          <div className="space-y-4 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-[#4169E1] hover:text-[#3154b3] hover:underline transition-colors"
            >
              Forgot your password?
            </Link>
            <div className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#4169E1] hover:text-[#3154b3] hover:underline transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Welcome Banner */}
      <div className="hidden md:flex relative bg-[#4169E1] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?text=travel')] bg-cover bg-center opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1] to-[#3154b3]" />
        </div>

        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-12">
            <Plane className="h-24 w-24 text-white animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-lg text-white/90 mb-12 max-w-md">
            Discover amazing destinations and book your next adventure with
            AirZkare
          </p>

          <div className="grid gap-8 text-left w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Best Flight Deals</h3>
                <p className="text-sm text-white/75">
                  Find the most competitive prices for your travel needs
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Booking</h3>
                <p className="text-sm text-white/75">
                  Your transactions are protected with advanced encryption
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                <Cloud className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-white/75">
                  Our dedicated team is always ready to assist you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
