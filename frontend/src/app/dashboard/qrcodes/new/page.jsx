"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewQRCodePage() {
    const [accessType, setAccessType] = useState('single');

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/qrcodes" className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Generate QR Code</h1>
                    <p className="text-slate-500 text-sm mt-1">Create a new access pass for an attendee or staff member.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Holder Information</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="e.g. john@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    placeholder="+1 234 567 890"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Access Configuration</h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Target Event / Location *</label>
                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-700">
                                    <option value="" disabled selected>Select an event</option>
                                    <option value="1">Gala Dinner - Main Hall</option>
                                    <option value="2">Tech Conference - VIP Lounge</option>
                                    <option value="3">HQ Building - All Access</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700">Access Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAccessType('single')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${accessType === 'single' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="font-semibold mb-1">Single Use</div>
                                        <div className="text-xs font-normal opacity-80">Valid for exactly 1 scan</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccessType('multi')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${accessType === 'multi' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="font-semibold mb-1">Multi Use</div>
                                        <div className="text-xs font-normal opacity-80">Valid for N scans</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccessType('unlimited')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${accessType === 'unlimited' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="font-semibold mb-1">Unlimited</div>
                                        <div className="text-xs font-normal opacity-80">Valid during timeframe</div>
                                    </button>
                                </div>
                            </div>

                            {accessType === 'multi' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-sm font-medium text-slate-700">Number of Allowed Scans</label>
                                    <input
                                        type="number"
                                        min="2"
                                        placeholder="e.g. 5"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Valid From</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Valid Until</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-28">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Preview</h2>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-48 h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 relative overflow-hidden group">
                                <span className="text-slate-400 font-medium text-sm px-4">QR Code will appear here</span>
                                {/* Mock Scan animation */}
                                <div className="absolute inset-0 bg-blue-500/10 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]">
                                    <div className="h-0.5 w-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>

                            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Holder:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[120px]">Awaiting Input</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Event:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[120px]">Not Selected</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Type:</span>
                                    <span className="font-semibold text-blue-600 capitalize">{accessType} Use</span>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Generate & Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom generic styling for the scanner animation */}
            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
            `}</style>
        </div>
    );
}
