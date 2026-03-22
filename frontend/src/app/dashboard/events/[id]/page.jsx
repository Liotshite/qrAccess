"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Calendar, MapPin, QrCode, Edit2, Trash2, ArrowLeft, Plus, Download, X, CheckCircle2 } from "lucide-react";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id;

    const [event, setEvent] = useState(null);
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal states
    const [showQrModal, setShowQrModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // QR Generation Form
    const [qrForm, setQrForm] = useState({
        fullName: "", email: "", phone: "",
        accessType: 'single', limit: "1",
        validFrom: "", validUntil: ""
    });
    const [generatingQr, setGeneratingQr] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [qrError, setQrError] = useState("");

    // Edit Form
    const [editForm, setEditForm] = useState({
        title: "", description: "", location: "", startDate: "", endDate: ""
    });
    const [updatingEvent, setUpdatingEvent] = useState(false);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        if (eventId) fetchAll();
    }, [eventId]);

    const fetchAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [eventRes, qrRes] = await Promise.all([
                fetch(`http://localhost:5000/events/${eventId}`, { credentials: "include" }),
                fetch(`http://localhost:5000/qr/event/${eventId}`, { credentials: "include" })
            ]);
            const eventData = await eventRes.json();
            const qrData = await qrRes.json();

            if (eventData.success) {
                setEvent(eventData.event);
                setEditForm({
                    title: eventData.event.title,
                    description: eventData.event.description || "",
                    location: eventData.event.location || "",
                    startDate: new Date(eventData.event.start_date).toISOString().slice(0, 16),
                    endDate: new Date(eventData.event.end_date).toISOString().slice(0, 16)
                });
            } else {
                setError("Événement introuvable.");
            }
            if (qrData.success) setQrCodes(qrData.qrs || []);
        } catch (err) {
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setEditError("");
        setUpdatingEvent(true);
        try {
            const res = await fetch(`http://localhost:5000/events/${eventId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                setShowEditModal(false);
                fetchAll();
            } else {
                setEditError(data.message || "Erreur lors de la mise à jour.");
            }
        } catch {
            setEditError("Erreur de connexion au serveur.");
        } finally {
            setUpdatingEvent(false);
        }
    };

    const handleDeleteEvent = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:5000/events/${eventId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                router.push("/dashboard/events");
            } else {
                alert(data.message || "Erreur lors de la suppression.");
                setShowDeleteConfirm(false);
            }
        } catch {
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleGenerateQr = async (e) => {
        e.preventDefault();
        setQrError("");
        setGeneratingQr(true);
        try {
            const res = await fetch(`http://localhost:5000/qr/generate/${eventId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(qrForm)
            });
            const data = await res.json();
            if (data.success) {
                setSuccessData(data);
                setQrForm({ ...qrForm, fullName: "", email: "", phone: "" });
                // Refresh QR list
                const qrRes = await fetch(`http://localhost:5000/qr/event/${eventId}`, { credentials: "include" });
                const qrData = await qrRes.json();
                if (qrData.success) setQrCodes(qrData.qrs || []);
            } else {
                setQrError(data.message || "Erreur lors de la génération.");
            }
        } catch {
            setQrError("Erreur de connexion au serveur.");
        } finally {
            setGeneratingQr(false);
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'active') return 'bg-emerald-100 text-emerald-700';
        if (status === 'exhausted') return 'bg-amber-100 text-amber-700';
        if (status === 'expired') return 'bg-orange-100 text-orange-700';
        if (status === 'revoked') return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-600';
    };

    const getEventStatus = () => {
        if (!event) return { label: "—", style: "bg-slate-100 text-slate-600" };
        const now = new Date();
        if (new Date(event.start_date) > now) return { label: "Upcoming", style: "bg-blue-100 text-blue-700" };
        if (new Date(event.end_date) < now) return { label: "Past", style: "bg-slate-100 text-slate-600" };
        return { label: "Active", style: "bg-emerald-100 text-emerald-700" };
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                <p className="text-slate-500 font-medium">Chargement de l'événement...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">{error || "Événement introuvable"}</h1>
                <Link href="/dashboard/events" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux événements
                </Link>
            </div>
        );
    }

    const evtStatus = getEventStatus();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link href="/dashboard/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Retour aux événements
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setShowEditModal(true); setEditError(""); }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                    >
                        <Edit2 className="w-4 h-4" /> Modifier
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 active:scale-95 transition-all shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                </div>
            </div>

            {/* Event Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${evtStatus.style}`}>{evtStatus.label}</span>
                            <span className="text-xs text-slate-400 font-medium">ID #{event.id}</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
                        {event.description && (
                            <p className="text-slate-500 leading-relaxed max-w-2xl">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-5 pt-1">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    {' → '}
                                    {new Date(event.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium">{event.location || "Lieu non défini"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <QrCode className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium">{qrCodes.length} QR code{qrCodes.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setShowQrModal(true); setSuccessData(null); setQrError(""); }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow active:scale-95 transition-all text-sm flex-shrink-0"
                    >
                        <Plus className="w-5 h-5" /> Générer un QR
                    </button>
                </div>
            </div>

            {/* QR Codes Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Codes QR de cet événement</h2>
                    <span className="text-sm text-slate-500">{qrCodes.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-3">Titulaire</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Utilisations</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3">Créé le</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                            {qrCodes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-14 text-center">
                                        <div className="w-14 h-14 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <QrCode className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900">Aucun QR code</h3>
                                        <p className="text-slate-500 text-sm mt-1">Générez votre premier code QR pour cet événement.</p>
                                        <button
                                            onClick={() => { setShowQrModal(true); setSuccessData(null); setQrError(""); }}
                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Générer un QR
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                qrCodes.map((qr) => (
                                    <tr key={qr.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {qr.holder?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-slate-900">{qr.holder}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{qr.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-700">{qr.scans}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(qr.status)}`}>
                                                {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{qr.createdAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a
                                                    href={`http://localhost:5000/qrcodes/qr_${qr.token}.png`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                    title="Télécharger le QR"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL: Generate QR ── */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Générer un QR Code</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Pour : <span className="font-medium text-slate-700">{event.title}</span></p>
                            </div>
                            <button onClick={() => setShowQrModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6">
                            {successData ? (
                                <div className="text-center space-y-4">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">QR Code généré !</h3>
                                    <img
                                        src={`http://localhost:5000${successData.qrUrl}`}
                                        alt="QR Code généré"
                                        className="w-40 h-40 rounded-xl border border-slate-100 p-1.5 mx-auto shadow-sm"
                                    />
                                    <div className="flex gap-3 justify-center pt-2">
                                        <a
                                            href={`http://localhost:5000${successData.qrUrl}`}
                                            download
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> Télécharger
                                        </a>
                                        <button
                                            onClick={() => setSuccessData(null)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                                        >
                                            Nouveau QR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleGenerateQr} className="space-y-4">
                                    {qrError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{qrError}</div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom complet *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Jean Dupont"
                                                value={qrForm.fullName}
                                                onChange={(e) => setQrForm({ ...qrForm, fullName: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                                            <input
                                                type="email"
                                                placeholder="jean@exemple.com"
                                                value={qrForm.email}
                                                onChange={(e) => setQrForm({ ...qrForm, email: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Téléphone</label>
                                            <input
                                                type="tel"
                                                placeholder="+33 6 00 00 00 00"
                                                value={qrForm.phone}
                                                onChange={(e) => setQrForm({ ...qrForm, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type d'accès</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'single', label: 'Simple', desc: '1 scan' },
                                                { value: 'multi', label: 'Multiple', desc: 'N scans' },
                                                { value: 'unlimited', label: 'Illimité', desc: '∞ scans' }
                                            ].map(({ value, label, desc }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setQrForm({ ...qrForm, accessType: value, limit: value === 'single' ? "1" : value === 'unlimited' ? "999999" : "2" })}
                                                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${qrForm.accessType === value ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    <div className="font-semibold">{label}</div>
                                                    <div className="text-xs opacity-70">{desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {qrForm.accessType === 'multi' && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre de scans</label>
                                            <input
                                                type="number"
                                                min="2"
                                                value={qrForm.limit}
                                                onChange={(e) => setQrForm({ ...qrForm, limit: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valide du</label>
                                            <input
                                                type="datetime-local"
                                                value={qrForm.validFrom}
                                                onChange={(e) => setQrForm({ ...qrForm, validFrom: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-600"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valide jusqu'au</label>
                                            <input
                                                type="datetime-local"
                                                value={qrForm.validUntil}
                                                onChange={(e) => setQrForm({ ...qrForm, validUntil: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-600"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={generatingQr}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {generatingQr ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                                        {generatingQr ? "Génération..." : "Générer & Sauvegarder"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: Edit Event ── */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Modifier l'événement</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateEvent} className="p-6 space-y-4">
                            {editError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{editError}</div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Titre *</label>
                                <input
                                    required
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lieu</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date de début</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-600"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date de fin</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.endDate}
                                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                                <textarea
                                    rows="3"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updatingEvent}
                                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {updatingEvent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit2 className="w-5 h-5" />}
                                {updatingEvent ? "Mise à jour..." : "Enregistrer les modifications"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: Delete Confirm ── */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Supprimer l'événement ?</h2>
                        <p className="text-slate-500 text-sm mt-2 mb-6">
                            Cette action supprimera définitivement <span className="font-semibold text-slate-700">"{event.title}"</span> et tous ses codes QR associés.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {isDeleting ? "Suppression..." : "Confirmer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
