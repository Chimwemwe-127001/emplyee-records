"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AtSign, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill email from query parameter
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Handle redirect manually as a fallback
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Check if sign-in was successful and redirect to /dashboard
      if (result?.ok) {
        console.log("Sign-in successful, redirecting to /dashboard");
        router.push("/dashboard"); // Manual redirect as a fallback
        toast.success("Signed in successfully");
      } else {
        throw new Error("Sign-in failed unexpectedly");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.error("Failed to sign in");
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
      {/* Left side - Placeholder */}
      <div className="relative hidden md:block md:w-1/2 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Task_manager-KymZtqbJACZF7EmvWaCd2bYRGLO6Hg.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="mix-blend-overlay"
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

      {/* Right side - Sign in form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#013c61] mb-2">Sign in to your account</h1>
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6a7e8a]"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{" "}
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