"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        organizationName: "",
        confirmOrganizationName: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasOrganization, setHasOrganization] = useState(true);

    // Strict Password Validator matching the backend rules
    const isValidPassword = (password) => {
        if (password.length < 12) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isValidPassword(formData.password)) {
            setError("Le mot de passe doit contenir au moins 12 caractères, incluant des majuscules, des minuscules, des chiffres et des symboles spéciaux (!@#$).");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (hasOrganization && formData.organizationName.trim() !== formData.confirmOrganizationName.trim()) {
            setError("Organization names do not match!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/user/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Important to capture the HttpOnly cookie
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    organizationName: hasOrganization ? formData.organizationName : formData.fullName,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                // Redirect user after short delay or instantly
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError(data.message || "Something went wrong during registration.");
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
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
                        Secure Your Organisation
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-md text-center">
                        Generate and manage secure QR codes. Keep track of access and empower your agents smoothly.
                    </p>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-[600px] xl:w-[700px] flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-white lg:shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] z-20">
                <div className="w-full max-w-md">
                    <div className="mb-10 lg:text-left text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-3 text-slate-900">
                            Create an Account
                        </h1>
                        <p className="text-slate-500 text-base">
                            Sign up to start generating secure QR codes for your organization.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm text-center font-medium">
                            Registration successful! Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 block mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Lionel Doe"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                            />
                        </div>

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

                        {/* Organization Group - Side by Side */}
                        {hasOrganization && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        placeholder="Acme Corp"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                                        Confirm Org Name
                                    </label>
                                    <input
                                        type="text"
                                        name="confirmOrganizationName"
                                        value={formData.confirmOrganizationName}
                                        onChange={handleChange}
                                        placeholder="Acme Corp"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                                    />
                                </div>
                            </div>
                        )}

                        {/* No Organization Checkbox */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="noOrganization"
                                checked={!hasOrganization}
                                onChange={() => setHasOrganization(!hasOrganization)}
                                className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="noOrganization" className="text-sm text-slate-600">
                                Je n'ai pas d'organisation (Utiliser mon nom complet)
                            </label>
                        </div>

                        {/* Password Group - Side by Side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 block mb-1">
                                    Password
                                </label>
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
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 block mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-800"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 -mt-2">
                            Doit contenir au moins 12 caractères, incluant majuscules, minuscules, nombres et symboles (!@#$).
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 py-3.5 px-4 bg-gradient-to-r ${loading ? 'from-slate-400 to-slate-500 cursor-not-allowed' : 'from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600'} text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]`}
                        >
                            {loading ? "Registering..." : (hasOrganization ? "Register Organization" : "Create Account")}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-500 transition-colors font-semibold hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
