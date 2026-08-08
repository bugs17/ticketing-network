"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  QrCode, 
  Building2, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  User,
  Phone,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { getReportPageData, createTicketReport } from "../actions/get-report-page-data";

function OPDReportingContent() {
  const searchParams = useSearchParams();
  const clientToken = searchParams.get("client");

  const [opdData, setOpdData] = useState(null);
  const [hasActiveTicket, setHasActiveTicket] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  // Form Input
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState("");

  const fetchData = async () => {
    if (!clientToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const res = await getReportPageData(clientToken);

    if (res.success) {
      setOpdData(res.opd);
      setFilteredTickets(res.tickets);
      setHasActiveTicket(res.hasActiveTicket);

      const activeTicket = res.tickets.find(
        (t) => t.status === "proses" || t.status === "menunggu"
      );
      if (activeTicket) {
        setExpandedTicketId(activeTicket.id);
      }
    } else {
      setErrorMessage(res.error || "Gagal memuat data.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [clientToken]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (hasActiveTicket || !opdData) return;

    if (!issueDescription) {
      alert("Harap isi deskripsi kendala.");
      return;
    }

    setIsSubmitting(true);

    const res = await createTicketReport({
      opdId: opdData.id,
      issueDescription,
    });

    setIsSubmitting(false);

    if (res.success) {
      setGeneratedTicketId(res.ticketId);
      setIsSubmitted(true);
      fetchData();
    } else {
      alert(res.error || "Gagal mengirimkan laporan.");
    }
  };

  const toggleExpandTicket = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
          <span>Memverifikasi token identifikasi OPD...</span>
        </div>
      </div>
    );
  }

  if (!opdData) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-zinc-950">Akses Tautan Tidak Valid</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {errorMessage || "Token identifikasi OPD tidak ditemukan."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between font-sans">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen border-x border-zinc-150 flex flex-col shadow-sm">
        
        {/* HEADER */}
        <header className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-950 rounded-lg flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-zinc-900 tracking-tight">E-Reporting Center</h1>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Verifikasi Barcode Lokasi
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md truncate max-w-[120px]">
            {clientToken}
          </span>
        </header>

        {/* CONTAINER */}
        <main className="flex-1 p-5 space-y-6">
          
          {/* INFO OPD */}
          <div className="bg-zinc-950 text-white p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl shrink-0 mt-0.5">
                <Building2 className="w-4 h-4 text-zinc-200" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Pelapor Terbaca Otomatis</span>
                <h2 className="text-sm font-bold tracking-tight">{opdData.nama || "OPD Tanpa Nama"}</h2>
              </div>
            </div>

            {(opdData.nama_pic || opdData.kontak_pic) && (
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3 h-3 text-zinc-400" /> {opdData.nama_pic || "-"}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
                  <Phone className="w-3 h-3 text-zinc-400" /> {opdData.kontak_pic || "-"}
                </span>
              </div>
            )}
          </div>

          {/* WARNING ACTIVE TICKET */}
          {hasActiveTicket && !isSubmitted && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex gap-2.5 text-amber-800">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold">Formulir Terkunci Sementara</h4>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Laporan Anda masih dalam penanganan. Pembuatan tiket baru dinonaktifkan hingga status tiket sebelumnya selesai.
                </p>
              </div>
            </div>
          )}

          {/* FORM / SUCCESS MESSAGE */}
          {isSubmitted ? (
            <div className="text-center py-8 px-4 space-y-3 bg-emerald-50/40 border border-emerald-200 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-zinc-950">Laporan Berhasil Terkirim!</h3>
                <p className="text-[11px] text-zinc-500">Tiket baru Anda telah terdaftar.</p>
              </div>
              <div className="inline-block font-mono text-xs font-bold text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-xl">
                {generatedTicketId}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className={`space-y-4 ${hasActiveTicket ? "opacity-50 select-none" : ""}`}>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Formulir Gangguan</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Tuliskan kendala infrastruktur atau perangkat teknis yang dihadapi.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Deskripsi Kerusakan
                </label>
                <textarea
                  rows={3} required placeholder="Jelaskan detail permasalahan teknis..."
                  disabled={hasActiveTicket || isSubmitting}
                  value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 disabled:bg-zinc-100 disabled:cursor-not-allowed shadow-xs resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={hasActiveTicket || isSubmitting}
                className="w-full mt-1 cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{hasActiveTicket ? "Form Terkunci Sementara" : "Kirim Laporan Gangguan"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* LOG TIKET */}
          {filteredTickets.length > 0 && (
            <div className="pt-4 border-t border-zinc-150 space-y-3">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Log & Riwayat Laporan</h3>

              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const isActive = ticket.status === "proses" || ticket.status === "menunggu";
                  const isExpanded = expandedTicketId === ticket.id;

                  return (
                    <div 
                      key={ticket.id} 
                      className={`border rounded-2xl overflow-hidden transition-all shadow-xs ${
                        isActive 
                          ? "border-blue-200 bg-blue-50/30" 
                          : "border-zinc-200 bg-zinc-50/50"
                      }`}
                    >
                      <div 
                        onClick={() => toggleExpandTicket(ticket.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-zinc-400">TCK-{ticket.id}</span>
                            
                            {ticket.status === "selesai" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-emerald-50 text-emerald-700 border-emerald-100">
                                ✅ Selesai
                              </span>
                            )}
                            {ticket.status === "proses" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-blue-100 text-blue-700 border-blue-200">
                                ⚡ Diproses
                              </span>
                            )}
                            {ticket.status === "menunggu" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-amber-50 text-amber-700 border-amber-200">
                                ⏳ Menunggu
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-zinc-800 line-clamp-1 pr-4">
                            {ticket.deskripsi_masalah || "Tidak ada deskripsi"}
                          </p>
                        </div>

                        <div className="text-zinc-400 shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-zinc-100 space-y-3 bg-white">
                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Deskripsi Kendala:</span>
                            <p className="text-zinc-700 leading-relaxed font-medium">{ticket.deskripsi_masalah || "-"}</p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ticket.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {(ticket.url_foto_before || ticket.url_foto_after) && (
                              <span className="flex items-center gap-1 text-blue-600 font-bold">
                                <ImageIcon className="w-3 h-3" /> Terdapat Bukti Foto
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>

        <footer className="p-4 border-t border-zinc-100 text-center bg-zinc-50">
          <p className="text-[10px] text-zinc-400 font-medium">
            Sistem Keamanan Terintegrasi • {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </div>
  );
}

export default function OPDReportingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
          <div className="text-xs font-medium text-zinc-400 animate-pulse">Memuat halaman...</div>
        </div>
      }
    >
      <OPDReportingContent />
    </Suspense>
  );
}