"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: implement login API call
        console.log("Logging in...", formData);
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-slate-900 overflow-hidden relative">
            {/* Left Side - Branding / Logo (Hidden on small screens) */}
            <div className="hidden lg:flex lg:flex-1 relative bg-slate-50 items-center justify-center flex-col overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/40 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-300/30 blur-[120px] pointer-events-none" />

                {/* Logo and Tagline */}
                <div className="relative z-10 flex flex-col items-center">
                    <img
                        src="/logo/SI_logo-removebg-preview.png"
                        alt="QR Access Logo"
                        className="w-64 h-auto drop-shadow-xl mb-8 transform transition-transform hover:scale-105 duration-500"
                    />
                    <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-md text-center">
                        Access your dashboard to manage your QR codes, events, and agents securely.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[600px] xl:w-[700px] flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-white lg:shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] z-20">
                <div className="w-full max-w-md">
                    <div className="mb-10 lg:text-left text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-3 text-slate-900">
                            Sign In
                        </h1>
                        <p className="text-slate-500 text-base">
                            Enter your email and password to access your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 block mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="lionel@example.com"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account yet?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:text-blue-500 transition-colors font-semibold hover:underline"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
