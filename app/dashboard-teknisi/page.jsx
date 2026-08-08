"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  User,
  LogOut,
  Search,
  Camera,
  ArrowLeft,
  FileText,
  Save
} from "lucide-react";
import { getTicketsData, finishAndCloseTicket, savePartialProgress, setTicketToProgress } from "../actions/tickets-teknisi";
import Header from "@/components/dashboard-teknisi/header";
import { getUserProfile } from "../actions/auth";


export default function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("tugas");
  const [activeTask, setActiveTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State internal untuk Form input isi troubleshoot
  const [realIssue, setRealIssue] = useState("");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState(null);

  // Load data awal dari Prisma SQLite
  useEffect(() => {
    async function loadData() {
      const data = await getTicketsData();
      setTickets(data.activeTickets || []);
      setHistoryTickets(data.historyTickets || []);
    }
    loadData();
  }, []);


  useEffect(() => {
    async function fetchUser() {
      const data = await getUserProfile();
      if (data) setUser(data);
    }
    fetchUser();
  }, []);

  const handleSetProgress = (ticketId) => {
    startTransition(async () => {
      try {
        await setTicketToProgress(ticketId);
        setTickets(prev => prev.map(t => {
          if (t.id === ticketId) {
            return { ...t, status: "proses" };
          }
          return t;
        }));
      } catch (err) {
        alert(err.message);
      }
    });
  };

  const handleOpenForm = (ticket) => {
    setActiveTask(ticket);
    setRealIssue(ticket.deskripsi_masalah || "");
    setBeforeImage(ticket.url_foto_before || null);
    setAfterImage(ticket.url_foto_after || null);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "before") setBeforeImage(reader.result);
        if (type === "after") setAfterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePartialProgress = () => {
    if (!realIssue) {
      alert("Harap isi deskripsi troubleshoot/kendala penundaan terlebih dahulu!");
      return;
    }

    startTransition(async () => {
      try {
        await savePartialProgress({
          ticketId: activeTask.id,
          realIssue,
          beforeImage
        });

        setTickets(prev => prev.map(t => {
          if (t.id === activeTask.id) {
            return { 
              ...t, 
              status: "proses",
              deskripsi_masalah: realIssue, 
              url_foto_before: beforeImage
            };
          }
          return t;
        }));

        alert("Progress berhasil disimpan! Status tetap 'On-Progress' di database.");
        setActiveTask(null);
      } catch (err) {
        alert(err.message);
      }
    });
  };

  const handleFinishTask = (e) => {
    e.preventDefault();
    if (!realIssue || !beforeImage || !afterImage) {
      alert("Untuk MENUTUP TIKET, Anda wajib mengisi Analisis Solusi serta melampirkan Foto Before & After!");
      return;
    }

    startTransition(async () => {
      try {
        await finishAndCloseTicket({
          ticketId: activeTask.id,
          realIssue,
          beforeImage,
          afterImage
        });

        const completedTicket = {
          ...activeTask,
          status: "selesai",
          deskripsi_masalah: realIssue,
          url_foto_before: beforeImage,
          url_foto_after: afterImage,
          updatedAt: new Date().toISOString()
        };

        setHistoryTickets([completedTicket, ...historyTickets]);
        setTickets(prev => prev.filter(t => t.id !== activeTask.id));
        
        setActiveTask(null);
        setRealIssue("");
        setBeforeImage(null);
        setAfterImage(null);
        setActiveTab("selesai");

        alert("Pekerjaan dinyatakan Selesai. Tiket ditutup!");
      } catch (err) {
        alert(err.message);
      }
    });
  };

  // Helper badge prioritas
  const getPriorityBadge = (prioritas) => {
    switch (prioritas?.toLowerCase()) {
      case "high":
      case "kritis":
        return "bg-red-50 text-red-700 border-red-100";
      case "medium":
      case "tinggi":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  // Filter pencarian tiket
  const filteredTickets = tickets.filter(t => 
    t.opd?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(t.id).includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-12 font-sans">
      
      {/* JIKA SEDANG MEMBUKA HALAMAN UPLOAD / UPDATE PROGRESS */}
      {activeTask ? (
        <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col justify-between">
          
          {/* HEADER FORM */}
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-4 py-4 flex items-center gap-3 z-30">
            <button onClick={() => setActiveTask(null)} className="p-1.5 hover:bg-zinc-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-800" />
            </button>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Dokumentasi Kerja</span>
              <h2 className="text-sm font-bold text-zinc-950">{activeTask.opd?.nama || "OPD"} (TK-{activeTask.id})</h2>
            </div>
          </div>

          {/* FORM INPUTS */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-150 space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Masalah Awal</span>
              <p className="text-xs font-medium text-zinc-700 leading-relaxed">{activeTask.deskripsi_masalah || "Belum ada catatan awal"}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800">
                Analisis Lapangan & Tindakan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Tulis temuan asli atau kendala (Misal: Butuh ganti converter baru, besok dilanjut karena nunggu barang gudang...)"
                value={realIssue}
                onChange={(e) => setRealIssue(e.target.value)}
                className="w-full px-3.5 py-3 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800">Foto Kondisi Rusak (Before)</label>
              <div className="relative">
                {beforeImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border">
                    <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setBeforeImage(null)} className="absolute top-2 right-2 bg-zinc-950/80 text-white p-1.5 rounded-lg text-[10px] font-bold">Ganti</button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl aspect-video flex flex-col items-center justify-center bg-zinc-50/50">
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => handleImageUpload(e, "before")} className="hidden" />
                    <Camera className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-xs font-bold text-zinc-700">Ambil Foto Masalah</span>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-800">
                Foto Setelah Perbaikan (After) <span className="text-zinc-400 text-[10px] font-normal">(Wajib jika tiket ditutup)</span>
              </label>
              <div className="relative">
                {afterImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border">
                    <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setAfterImage(null)} className="absolute top-2 right-2 bg-zinc-950/80 text-white p-1.5 rounded-lg text-[10px] font-bold">Ganti</button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl aspect-video flex flex-col items-center justify-center bg-zinc-50/50">
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => handleImageUpload(e, "after")} className="hidden" />
                    <Camera className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-xs font-bold text-zinc-700">Ambil Foto Hasil Solusi</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* DUAL ACTION BOTTOM BUTTONS */}
          <div className="p-4 border-t border-zinc-100 bg-white grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSavePartialProgress}
              className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Simpan Terkendala
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleFinishTask}
              className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesai & Tutup
            </button>
          </div>

        </div>
      ) : (
        
        /* LAYOUT DASHBOARD UTAMA TEKNISI */
        <>
          <Header user={user} />

          <div className="max-w-md mx-auto px-4 py-4 space-y-4">
            
            {/* SUMMARY STATS */}
            <div className="bg-zinc-950 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tugas Hari Ini</span>
                <span className="text-2xl font-bold block">{tickets.length} Tiket</span>
                <span className="text-[10px] text-zinc-300 block">Butuh tindakan segera</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <AlertTriangle className={`w-6 h-6 text-amber-400 ${tickets.length > 0 ? "animate-pulse" : ""}`} />
              </div>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID tiket atau OPD..."
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-zinc-400 transition-colors"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* TABS CONTROL */}
            <div className="flex bg-zinc-200/60 p-1 rounded-xl">
              <button onClick={() => setActiveTab("tugas")} className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${activeTab === "tugas" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}>
                Tugas Lapangan ({tickets.length})
              </button>
              <button onClick={() => setActiveTab("selesai")} className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${activeTab === "selesai" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}>
                Selesai Beres ({historyTickets.length})
              </button>
            </div>

            {/* DAFTAR TIKET */}
            {activeTab === "tugas" ? (
              <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white border border-zinc-150 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-500">TK-{ticket.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              ticket.status === "proses" ? "bg-blue-50 text-blue-700 border-blue-100" : getPriorityBadge(ticket.opd?.prioritas)
                            }`}>
                              {ticket.status === "proses" ? "⚡ On Progress" : ticket.opd?.prioritas || "Normal"}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-zinc-900 mt-1">{ticket.opd?.nama || "OPD"}</h3>
                        </div>
                      </div>

                      <div className="bg-zinc-50 p-3 rounded-xl border text-xs">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase block tracking-wider mb-0.5">Deskripsi Masalah</span>
                        <p className="font-bold text-zinc-800">{ticket.deskripsi_masalah || "Belum ada rincian"}</p>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-600">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span><strong>{ticket.opd?.nama || "-"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            PIC: {ticket.opd?.nama_pic || "-"} (
                            <a href={`tel:${ticket.opd?.kontak_pic}`} className="text-blue-600 underline font-semibold">
                              {ticket.opd?.kontak_pic || "-"}
                            </a>
                          )
                          </span>
                        </div>
                      </div>

                      {ticket.status === "menunggu" ? (
                        <button 
                          disabled={isPending}
                          onClick={() => handleSetProgress(ticket.id)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs rounded-2xl transition-all shadow-sm disabled:opacity-50"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          Mulai Kerjakan Sekarang
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenForm(ticket)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition-all shadow-sm"
                        >
                          <FileText className="w-4 h-4" />
                          Update Progress / Upload Bukti
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-2 bg-white border border-zinc-150 rounded-3xl p-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-800">Semua tugas selesai!</p>
                    <p className="text-[11px] text-zinc-400">Belum ada kiriman tiket baru dari system.</p>
                  </div>
                )}
              </div>
            ) : (
              /* TAB SELESAI */
              <div className="space-y-4">
                {historyTickets.length > 0 ? (
                  historyTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white border rounded-3xl p-5 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-zinc-400 block">TK-{ticket.id}</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-150">
                          Selesai
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900">{ticket.opd?.nama || "OPD"}</h4>
                      <div className="text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border">
                        <strong>Hasil Akhir:</strong> {ticket.deskripsi_masalah || "-"}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-zinc-400 block mb-1">BEFORE</span>
                          {ticket.url_foto_before ? (
                            <img src={ticket.url_foto_before} alt="Before" className="w-full h-20 object-cover rounded-xl border" />
                          ) : (
                            <div className="w-full h-20 bg-zinc-100 rounded-xl flex items-center justify-center text-[9px] text-zinc-400">Tidak Ada Foto</div>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-zinc-400 block mb-1">AFTER</span>
                          {ticket.url_foto_after ? (
                            <img src={ticket.url_foto_after} alt="After" className="w-full h-20 object-cover rounded-xl border" />
                          ) : (
                            <div className="w-full h-20 bg-zinc-100 rounded-xl flex items-center justify-center text-[9px] text-zinc-400">Tidak Ada Foto</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-2 bg-white border border-zinc-150 rounded-3xl p-6">
                    <Clock className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p className="text-xs font-bold text-zinc-800">Tidak ada riwayat selesai dalam 2 hari terakhir</p>
                    <p className="text-[11px] text-zinc-400">Tiket yang diselesaikan hari ini dan kemarin akan tercatat di sini.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}