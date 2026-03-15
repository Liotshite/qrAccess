"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function QRCodesPage() {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const res = await fetch("http://localhost:5000/qr/qrs", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                const data = await res.json();

                if (data.success) {
                    setQrCodes(data.qrs || []);
                } else {
                    setError("Impossible de charger les QR Codes.");
                }
            } catch (err) {
                console.error("Error fetching QRs:", err);
                setError("Erreur de connexion au serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">QR Codes</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor all generated access codes.</p>
                </div>
                <Link
                    href="/dashboard/qrcodes/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow active:scale-95 transition-all text-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Generate QR Code
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Event..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-colors"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <select className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Used</option>
                        <option>Inactive</option>
                    </select>
                    <select className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>All Events</option>
                        <option>Gala Dinner</option>
                        <option>Tech Conference</option>
                        <option>Warehouse</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-100/80 text-slate-600 text-sm border-b-2 border-slate-300">
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">QR ID</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Holder Name</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Event / Location</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Scans</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-300 text-slate-700 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                        <p className="mt-2 text-slate-500">Chargement des QR Codes...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-red-500 font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : qrCodes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">Aucun QR Code</h3>
                                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Générez votre premier QR Code pour vos invités ou vos équipes d'agents.</p>
                                    </td>
                                </tr>
                            ) : (
                                qrCodes.map((qr) => (
                                    <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{qr.id}</td>
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                {qr.holder ? qr.holder.charAt(0) : '?'}
                                            </div>
                                            {qr.holder}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{qr.event}</td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{qr.scans}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${qr.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                    qr.status === 'exhausted' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{qr.createdAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Ticket">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </button>
                                                <a href={`http://localhost:5000/qrcodes/qr_${qr.token}.png`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-block" title="Download QR">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                </a>
                                                {qr.status === 'active' ? (
                                                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Revoke Access">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
