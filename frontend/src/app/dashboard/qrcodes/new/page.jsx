"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function NewQRCodePage() {
    const [accessType, setAccessType] = useState('single');
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        eventId: "",
        limit: "1",
        validFrom: "",
        validUntil: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState(null);

    // Fetch Events for the Dropdown
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("http://localhost:5000/events", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                const data = await res.json();
                if (data.success) {
                    setEvents(data.events || []);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAccessTypeChange = (type) => {
        setAccessType(type);
        setFormData({ ...formData, limit: type === 'single' ? "1" : type === 'unlimited' ? "999999" : "2" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.fullName || !formData.eventId) {
            setError("Le nom complet et l'événement ciblé sont obligatoires.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/qr/generate/${formData.eventId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    accessType: accessType,
                    limit: formData.limit,
                    validFrom: formData.validFrom,
                    validUntil: formData.validUntil
                })
            });

            const data = await res.json();

            if (data.success) {
                setSuccessData(data);
                // Clear form or leave it for rapid fire creation
                setFormData({ ...formData, fullName: "", email: "", phone: "" });
            } else {
                setError(data.message || "Erreur lors de la génération du QR Code.");
            }
        } catch (err) {
            console.error("Error generating QR:", err);
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

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

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. John Doe"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="e.g. john@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
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
                                <select
                                    name="eventId"
                                    value={formData.eventId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-700"
                                >
                                    <option value="" disabled>Select an event</option>
                                    {loadingEvents ? (
                                        <option disabled>Loading events...</option>
                                    ) : (
                                        events.map(ev => (
                                            <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700">Access Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleAccessTypeChange('single')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${accessType === 'single' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="font-semibold mb-1">Single Use</div>
                                        <div className="text-xs font-normal opacity-80">Valid for exactly 1 scan</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAccessTypeChange('multi')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${accessType === 'multi' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="font-semibold mb-1">Multi Use</div>
                                        <div className="text-xs font-normal opacity-80">Valid for N scans</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAccessTypeChange('unlimited')}
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
                                        name="limit"
                                        value={formData.limit}
                                        onChange={handleChange}
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
                                        name="validFrom"
                                        value={formData.validFrom}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Valid Until</label>
                                    <input
                                        type="datetime-local"
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleChange}
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

                            {successData ? (
                                <div className="w-full bg-emerald-50 rounded-2xl border-2 border-emerald-500 p-4 mb-6 flex flex-col items-center">
                                    <img src={`http://localhost:5000${successData.qrUrl}`} alt="Generated QR" className="w-48 h-48 object-contain rounded-xl bg-white shadow-sm p-2 mb-3" />
                                    <span className="text-emerald-700 font-medium text-sm">Successfully Generated!</span>
                                </div>
                            ) : (
                                <div className="w-48 h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 relative overflow-hidden group">
                                    <span className="text-slate-400 font-medium text-sm px-4">QR Code will appear here</span>
                                    {/* Mock Scan animation */}
                                    <div className="absolute inset-0 bg-blue-500/10 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]">
                                        <div className="h-0.5 w-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                </div>
                            )}

                            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Holder:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[120px]">{successData?.qrCode?.holder_name || formData.fullName || "Awaiting Input"}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Event:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[120px]">
                                        {successData?.event?.title || (events.find(e => e.id == formData.eventId)?.name || "Not Selected")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Type:</span>
                                    <span className="font-semibold text-blue-600 capitalize">{accessType} Use</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                )}
                                {loading ? "Generating..." : "Generate & Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
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
