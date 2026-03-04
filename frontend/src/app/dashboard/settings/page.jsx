"use client";

import { useState } from "react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Organization Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your account details and platform preferences.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Profile Section */}
                <div className="p-6 sm:p-8 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h2>

                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl shadow-sm border-2 border-white ring-1 ring-slate-100">
                                LD
                            </div>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Change Photo</button>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Lionel"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Doe"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="lionel@example.com"
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500">To change your email address, please contact support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization Details */}
                <div className="p-6 sm:p-8 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Organization Details</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Organization Name</label>
                            <input
                                type="text"
                                defaultValue="Acme Corp"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors max-w-md"
                            />
                        </div>
                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-slate-700">Plan</label>
                            <div className="flex items-center gap-4 max-w-md p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex-1">
                                    <p className="font-semibold text-blue-900">Pro Plan</p>
                                    <p className="text-xs text-blue-700">Billed annually, next charge Oct 2026</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">Upgrade</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Security</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Change Password</p>
                                <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
                            </div>
                            <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm">Update</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
                                <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">Not Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Save Banner */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl shadow-sm transition-all text-sm">
                        Cancel
                    </button>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm active:scale-95 transition-all text-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
