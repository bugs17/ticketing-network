"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock
} from "lucide-react";

// Mock Database internal untuk verifikasi kode barcode
const OPD_DATABASE = {
  "DISKES-MLG": { name: "Dinas Kesehatan", address: "Gedung A, Lantai 2, Kota Malang" },
  "BAPPEDA-MLG": { name: "Bappeda Kota Malang", address: "Gedung Utama, Jl. Merdeka Timur" },
  "DISKOMINFO-MLG": { name: "Diskominfo Kota Malang", address: "Perkantoran Terpadu, Gedung A" }
};

// DATABASE GABUNGAN: Semua tiket (Aktif maupun Selesai) disimpan di sini
const ALL_TICKETS_DB = [
  {
    id: "TK-9801",
    opdCode: "BAPPEDA-MLG",
    issue: "Kabel FO Core 3 putus akibat dahan pohon tumbang",
    status: "on-progress", 
    createdAt: "18 Juli 2026, 14:00",
    updatedAt: "18 Juli 2026, 16:15",
    technician: "Rian Hidayat",
    notes: "Tim teknisi sedang berada di lokasi untuk penarikan kabel core baru dan splicing ulang."
  },
  {
    id: "TK-9544",
    opdCode: "BAPPEDA-MLG",
    issue: "Koneksi LAN di ruang rapat utama tidak terhubung",
    status: "fixed",
    resolvedAt: "15 Juli 2026, 11:30",
    technician: "Rian Hidayat",
    solution: "Mengganti konektor RJ45 yang longgar dan melakukan crimping ulang. Sinyal kembali stabil."
  },
  {
    id: "TK-9412",
    opdCode: "BAPPEDA-MLG",
    issue: "Printer sharing tidak bisa diakses dari komputer administrasi",
    status: "fixed",
    resolvedAt: "10 Juli 2026, 15:45",
    technician: "Ahmad Fauzi",
    solution: "Konfigurasi ulang IP static printer dan sharing permission pada Windows Network."
  }
];

export default function OPDReportingPage({ params }) {
  const unwrappedParams = React.use(params);
  const opdCode = unwrappedParams?.code?.toUpperCase(); 

  const [opdData, setOpdData] = useState(null);
  const [hasActiveTicket, setHasActiveTicket] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk melacak ID tiket mana yang sedang di-expand detail progresnya
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  // State Form Input
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState("");

  useEffect(() => {
    if (opdCode) {
      if (OPD_DATABASE[opdCode]) {
        setOpdData(OPD_DATABASE[opdCode]);
        
        // Ambil semua tiket milik OPD ini
        const opdTickets = ALL_TICKETS_DB.filter(t => t.opdCode === opdCode);
        setFilteredTickets(opdTickets);

        // Cek apakah ada salah satu tiket yang statusnya belum 'fixed'
        const active = opdTickets.some(t => t.status === "on-progress" || t.status === "assigned");
        setHasActiveTicket(active);

        // Otomatis expand tiket yang sedang aktif agar langsung terlihat progresnya
        const activeTicket = opdTickets.find(t => t.status === "on-progress" || t.status === "assigned");
        if (activeTicket) {
          setExpandedTicketId(activeTicket.id);
        }
      } else {
        setOpdData(null);
      }
      setIsLoading(false);
    }
  }, [opdCode]);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (hasActiveTicket) return; // Proteksi tambahan

    if (!reporterName || !reporterPhone || !issueDescription) {
      alert("Harap lengkapi semua kolom informasi pengaduan.");
      return;
    }

    const newId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(newId);
    setIsSubmitted(true);
  };

  const toggleExpandTicket = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="text-xs font-medium text-zinc-400 animate-pulse">Memverifikasi lokasi barcode...</div>
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
              Kode QR lokasi tidak dikenali. Pastikan Anda melakukan scan langsung pada barcode fisik resmi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between font-sans">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen border-x border-zinc-150 flex flex-col shadow-sm">
        
        {/* HEADER BRANDING */}
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
          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
            {opdCode}
          </span>
        </header>

        {/* CONTAINER UTAMA */}
        <main className="flex-1 p-5 space-y-6">
          
          {/* INFO KANTOR OPD */}
          <div className="bg-zinc-950 text-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl shrink-0 mt-0.5">
                <Building2 className="w-4 h-4 text-zinc-200" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Pelapor Terbaca Otomatis</span>
                <h2 className="text-sm font-bold tracking-tight">{opdData.name}</h2>
                <p className="text-[11px] text-zinc-300 leading-snug">{opdData.address}</p>
              </div>
            </div>
          </div>

          {/* BANNER NOTIFIKASI JIKA FORM DI-LOCK KARENA TIKET AKTIF */}
          {hasActiveTicket && !isSubmitted && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex gap-2.5 text-amber-800">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold">Formulir Terkunci Sementara</h4>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Unit kerja Anda memiliki laporan yang **sedang berjalan**. Pengiriman laporan baru dinonaktifkan sementara untuk mencegah data ganda. Periksa progres penanganan di bagian bawah halaman.
                </p>
              </div>
            </div>
          )}

          {/* AREA FORMULIR (BISA AKTIF / DISABLED / BERUBAH SUKSES CARD) */}
          {isSubmitted ? (
            <div className="text-center py-8 px-4 space-y-3 bg-emerald-50/40 border border-emerald-200 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-zinc-950">Laporan Berhasil Terkirim!</h3>
                <p className="text-[11px] text-zinc-500">Tiket baru Anda telah didaftarkan ke sistem.</p>
              </div>
              <div className="inline-block font-mono text-xs font-bold text-zinc-900 bg-white border border-zinc-200 Regal px-3 py-1.5 rounded-xl">
                {generatedTicketId}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className={`space-y-4 ${hasActiveTicket ? "opacity-50 select-none" : ""}`}>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Formulir Gangguan</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Laporkan kendala infrastruktur jaringan atau hardware di area kerja Anda.</p>
              </div>

              {/* INPUT NAMA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" /> Nama Admin Pelapor
                </label>
                <input
                  type="text" required placeholder="Contoh: Bpk Roni (Staff IT)"
                  disabled={hasActiveTicket}
                  value={reporterName} onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 disabled:bg-zinc-100 disabled:cursor-not-allowed shadow-xs"
                />
              </div>

              {/* INPUT WHATSAPP */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" /> No. WhatsApp Aktif
                </label>
                <input
                  type="tel" required placeholder="Contoh: 0812XXXXXXXX"
                  disabled={hasActiveTicket}
                  value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 disabled:bg-zinc-100 disabled:cursor-not-allowed shadow-xs"
                />
              </div>

              {/* INPUT DESKRIPSI KELUHAN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Deskripsi Kerusakan
                </label>
                <textarea
                  rows={3} required placeholder="Tuliskan kendala jaringan atau hardware ruangan Anda..."
                  disabled={hasActiveTicket}
                  value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 disabled:bg-zinc-100 disabled:cursor-not-allowed shadow-xs resize-none leading-relaxed"
                />
              </div>

              {/* TOMBOL KAMPANYE SUBMIT */}
              <button
                type="submit"
                disabled={hasActiveTicket}
                className="w-full mt-1 cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {hasActiveTicket ? "Form Terkunci Sementara" : "Kirim Laporan Gangguan"}
              </button>
            </form>
          )}

          {/* -------------------- SECTION LIST RIWAYAT TERPADU -------------------- */}
          {filteredTickets.length > 0 && (
            <div className="pt-4 border-t border-zinc-150 space-y-3">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Log & Riwayat Laporan</h3>

              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const isActive = ticket.status === "on-progress" || ticket.status === "assigned";
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
                      {/* HEADER KARTU TIKET (BISA DI-KLIK JIKA AKTIF) */}
                      <div 
                        onClick={() => isActive && toggleExpandTicket(ticket.id)}
                        className={`p-3.5 flex items-center justify-between ${
                          isActive ? "cursor-pointer hover:bg-blue-50/50" : "select-none"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-zinc-400">{ticket.id}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                              isActive 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                              {isActive ? "⚡ On-Progress" : "✅ Fixed"}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-zinc-800 line-clamp-1 pr-4">{ticket.issue}</p>
                        </div>

                        {/* Indikator Panah Hanya untuk Tiket Aktif yang Bisa Di-expand */}
                        {isActive ? (
                          <div className="text-blue-600 shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-medium whitespace-nowrap shrink-0">
                            {ticket.resolvedAt.split(',')[0]} {/* Ambil tanggalnya saja */}
                          </span>
                        )}
                      </div>

                      {/* ISI DETAIL ACCORDION (PROGRES TEKNISI UNTUK TIKET AKTIF) */}
                      {isActive && isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-blue-100/70 space-y-3 bg-white">
                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Keluhan Asli:</span>
                            <p className="text-zinc-700 leading-relaxed font-medium">{ticket.issue}</p>
                          </div>

                          <div className="relative pl-4 space-y-3 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-[1.5px] before:bg-zinc-200">
                            <div className="relative text-xs">
                              <div className="absolute -left-[14.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50" />
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-zinc-400 font-medium block">{ticket.updatedAt}</span>
                                <p className="font-bold text-zinc-900">Update Lapangan — {ticket.technician}</p>
                                <p className="text-zinc-600 text-[11px] leading-relaxed bg-zinc-50 p-2 rounded-xl border border-zinc-200 border-dashed mt-1">
                                  "{ticket.notes}"
                                </p>
                              </div>
                            </div>

                            <div className="relative text-xs">
                              <div className="absolute -left-[14.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-zinc-400 border-2 border-white" />
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-zinc-400 font-medium block">{ticket.createdAt}</span>
                                <p className="font-medium text-zinc-600">Tiket masuk antrean sistem Command Center pusat.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DETAIL UNTUK TIKET FIXED (LANGSUNG TERBUKA FORM SOLUSINYA SECARA STATIS) */}
                      {!isActive && (
                        <div className="px-3.5 pb-3.5 pt-0.5 space-y-2">
                          <div className="text-xs bg-white p-2.5 rounded-xl border border-zinc-150 space-y-1">
                            <div className="flex items-center justify-between text-[9px] text-zinc-400 font-medium mb-0.5">
                              <span>Solusi Selesai ({ticket.technician})</span>
                              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5"/> {ticket.resolvedAt}</span>
                            </div>
                            <p className="text-zinc-600 text-[11px] leading-relaxed">
                              "{ticket.solution}"
                            </p>
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

        {/* COMPACT FOOTER SECURITY STATEMENT */}
        <footer className="p-4 border-t border-zinc-100 text-center bg-zinc-50">
          <p className="text-[10px] text-zinc-400 font-medium">
            Sistem Keamanan Terintegrasi Smart-OPD • {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </div>
  );
}