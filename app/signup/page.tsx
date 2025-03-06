"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Eye, AtSign } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import ModelImage from "@/assets/images/Model.png";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success("Account created successfully");

      // Redirect to /signin with email as a query parameter
      router.push(`/signin?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.error("Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "No Hazzles",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    },
    {
      title: "Easy to Use",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left side - Image and text overlay */}
      <div className="relative hidden md:block md:w-1/2 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
          <Image
            src={ModelImage}
            alt="Sign Up Illustration"
            width={743}
            height={950}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div className="relative flex flex-col justify-end h-full p-8 text-white">
          <h2 className="text-2xl font-semibold mb-2">{slides[activeSlide].title}</h2>
          <p className="mb-8 text-center">{slides[activeSlide].description}</p>
          <div className="flex justify-center gap-2 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full ${index === activeSlide ? "bg-green-500" : "bg-white"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#013c61] mb-2">Create your free account</h1>
            <p className="text-gray-600">
              Already registered?{" "}
              <Link href="/signin" className="text-green-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm text-gray-500">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                      required
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm text-gray-500">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                      required
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-500">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    required
                  />
                  <AtSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]"
                  >
                    <Eye size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Continue"}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-green-500 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="mt-2">© 2023 Getchange. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}