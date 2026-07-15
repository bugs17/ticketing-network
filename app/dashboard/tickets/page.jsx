"use client";

import React, { useState } from "react";
import { 
  TicketPlus, 
  Trash2, 
  UserCheck, 
  CheckCircle, 
  PhoneCall, 
  Plus, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock Data Awal Tiket
const initialTickets = [
  {
    id: "TCK-1092",
    opd: "Dinas Kesehatan",
    issue: "Koneksi internet FO utama terputus",
    status: "Menunggu",
    time: "15 Jul 2026, 14:20",
    priority: "HIGH",
    phone: "0812-3456-7890"
  },
  {
    id: "TCK-1091",
    opd: "Diskominfo",
    issue: "Sistem Peta Jabatan tidak dapat sinkronisasi",
    status: "Proses",
    time: "15 Jul 2026, 11:05",
    priority: "MEDIUM",
    phone: "Manual Input"
  },
  {
    id: "TCK-1090",
    opd: "Bappeda",
    issue: "Aplikasi internal tidak bisa diakses (Error 502)",
    status: "Selesai",
    time: "14 Jul 2026, 09:15",
    priority: "HIGH",
    phone: "0821-9876-5432"
  }
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State untuk form tiket baru
  const [newOpd, setNewOpd] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newPhone, setNewPhone] = useState("");


    // State Pencarian dan Filter baru
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterMonth, setFilterMonth] = useState("ALL");
    const [filterYear, setFilterYear] = useState("ALL");

  // Handler: Tambah Tiket Baru (Manual Input via Telepon)
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newOpd || !newIssue) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      opd: newOpd,
      issue: newIssue,
      status: "Menunggu",
      time: "Baru saja",
      priority: newPriority,
      phone: newPhone || "Via Telepon"
    };

    setTickets([newTicket, ...tickets]);
    
    // Reset Form & Close Dialog
    setNewOpd("");
    setNewIssue("");
    setNewPriority("MEDIUM");
    setNewPhone("");
    setIsDialogOpen(false);
  };

  // Handler: Kirim Teknisi (Ubah status Menunggu -> Proses)
  const handleDispatchTech = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "Proses" } : t));
  };

  // Handler: Selesaikan Tiket (Ubah status Proses -> Selesai)
  const handleCompleteTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "Selesai" } : t));
  };

  // Handler: Hapus Tiket
  const handleDeleteTicket = (id) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tiket ${id}?`)) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };


  // Logika filter gabungan (Search + Status + Bulan + Tahun)
const filteredTickets = tickets.filter((ticket) => {
  // 1. Filter Pencarian Teks (Case Insensitive)
  const matchesSearch = 
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.opd.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.issue.toLowerCase().includes(searchQuery.toLowerCase());

  // 2. Filter Status
  const matchesStatus = filterStatus === "ALL" || ticket.status === filterStatus;

  // Memecah format waktu "15 Jul 2026, 14:20" atau mendeteksi "Baru saja"
  // Format bulan dipetakan untuk pencocokan filter
  const monthMap = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
    Jul: "07", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12"
  };

  let ticketMonth = "ALL";
  let ticketYear = "ALL";

  // Ekstrak bulan dan tahun jika format tanggal cocok ("DD Mmm YYYY, HH:MM")
  const dateParts = ticket.time.split(" ");
  if (dateParts.length >= 3) {
    const rawMonth = dateParts[1]; // contoh: "Jul"
    ticketMonth = monthMap[rawMonth] || "ALL";
    ticketYear = dateParts[2].replace(",", ""); // contoh: "2026"
  }

  // 3. Filter Bulan
  const matchesMonth = filterMonth === "ALL" || ticketMonth === filterMonth || ticket.time === "Baru saja";

  // 4. Filter Tahun
  const matchesYear = filterYear === "ALL" || ticketYear === filterYear || ticket.time === "Baru saja";

  return matchesSearch && matchesStatus && matchesMonth && matchesYear;
});

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BAR: TITLE & CREATE BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Kelola Tiket Aduan</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Daftar seluruh laporan gangguan masuk dan kontrol penanganan jaringan OPD.
          </p>
        </div>

        {/* DIALOG MODAL TAMBAH TIKET */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              Buat Tiket Manual
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-2xl bg-white border border-zinc-150 p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-zinc-500" />
                Buat Tiket Gangguan Manual
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Gunakan form ini jika instansi menghubungi via telepon atau tatap muka langsung.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateTicket} className="space-y-4 mt-4">
              {/* Input OPD */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">OPD Pelapor</label>
                <input 
                  type="text" 
                  placeholder="Contoh: BPKAD Timika"
                  required
                  value={newOpd}
                  onChange={(e) => setNewOpd(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-950 transition-colors"
                />
              </div>

              {/* Kontak Telepon */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Kontak / No. Telepon (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 0812-xxxx-xxxx"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-950 transition-colors"
                />
              </div>

              {/* Grid Input: Priority */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Urgensi Tiket</label>
                <div className="grid grid-cols-3 gap-2">
                  {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewPriority(lvl)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        newPriority === lvl 
                          ? "bg-zinc-950 border-zinc-950 text-white" 
                          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deskripsi Masalah */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Deskripsi Gangguan</label>
                <textarea 
                  rows={3}
                  placeholder="Tulis detail masalah jaringan atau sistem yang dilaporkan secara spesifik..."
                  required
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-950 transition-colors resize-none"
                />
              </div>

              <DialogFooter className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button 
                  type="button" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold rounded-xl text-zinc-600"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Buat Tiket
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
  
  {/* Input Pencarian (6/12 width di layar lebar) */}
  <div className="relative lg:col-span-6 w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
    <input 
      type="text" 
      placeholder="Cari berdasarkan ID tiket, nama OPD, atau masalah..." 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-9 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors"
    />
  </div>

  {/* Filter Status (2/12 width) */}
  <div className="lg:col-span-2 w-full">
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:border-zinc-950 transition-colors cursor-pointer appearance-none"
    >
      <option value="ALL">Semua Status</option>
      <option value="Menunggu">Menunggu</option>
      <option value="Proses">Proses</option>
      <option value="Selesai">Selesai</option>
    </select>
  </div>

    {/* Filter Bulan (2/12 width) */}
    <div className="lg:col-span-2 w-full">
        <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:border-zinc-950 transition-colors cursor-pointer appearance-none"
        >
        <option value="ALL">Semua Bulan</option>
        <option value="01">Januari</option>
        <option value="02">Februari</option>
        <option value="03">Maret</option>
        <option value="04">April</option>
        <option value="05">Mei</option>
        <option value="06">Juni</option>
        <option value="07">Juli</option>
        <option value="08">Agustus</option>
        <option value="09">September</option>
        <option value="10">Oktober</option>
        <option value="11">November</option>
        <option value="12">Desember</option>
        </select>
    </div>

    {/* Filter Tahun (2/12 width) */}
    <div className="lg:col-span-2 w-full">
        <select
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:border-zinc-950 transition-colors cursor-pointer appearance-none"
        >
        <option value="ALL">Semua Tahun</option>
        <option value="2026">2026</option>
        <option value="2025">2025</option>
        </select>
    </div>
    </div>

      {/* 3. MAIN TABLE CONTROLLER */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">ID TIKET</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">OPD PELAPOR</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">DESKRIPSI MASALAH</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PRIORITAS</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">STATUS</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">AKSI KONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-zinc-400">
                    Tidak ada tiket aktif saat ini.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-50/30 transition-colors group">
                    
                    {/* ID Tiket */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-100 px-2 py-1 rounded-md">
                        {ticket.id}
                      </span>
                    </td>

                    {/* OPD */}
                    <td className="p-4">
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-zinc-900 block">{ticket.opd}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{ticket.time}</span>
                      </div>
                    </td>

                    {/* Deskripsi */}
                    <td className="p-4 max-w-[280px]">
                      <p className="text-xs font-medium text-zinc-600 line-clamp-2" title={ticket.issue}>
                        {ticket.issue}
                      </p>
                      <span className="text-[9px] text-zinc-400 block mt-1">Kontak: {ticket.phone}</span>
                    </td>

                    {/* Prioritas */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                        ticket.priority === "HIGH" 
                          ? "bg-red-50 text-red-700 border border-red-100" 
                          : ticket.priority === "MEDIUM" 
                          ? "bg-amber-50 text-amber-700 border border-amber-100" 
                          : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        ticket.status === "Menunggu" 
                          ? "bg-amber-50 text-amber-700" 
                          : ticket.status === "Proses" 
                          ? "bg-blue-50 text-blue-700" 
                          : "bg-emerald-50 text-emerald-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ticket.status === "Menunggu" 
                            ? "bg-amber-500" 
                            : ticket.status === "Proses" 
                            ? "bg-blue-500 animate-pulse" 
                            : "bg-emerald-500"
                        }`} />
                        {ticket.status}
                      </span>
                    </td>

                    {/* Aksi Kontrol */}
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Aksi 1: Kirim Teknisi (Hanya muncul jika "Menunggu") */}
                        {ticket.status === "Menunggu" && (
                          <button
                            onClick={() => handleDispatchTech(ticket.id)}
                            className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            title="Kirim Teknisi ke Lapangan"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Kirim Teknisi
                          </button>
                        )}

                        {/* Aksi 2: Selesaikan Tiket (Hanya muncul jika "Proses") */}
                        {ticket.status === "Proses" && (
                          <button
                            onClick={() => handleCompleteTicket(ticket.id)}
                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            title="Selesaikan Masalah"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Selesaikan
                          </button>
                        )}

                        {/* Aksi 3: Selesai Pasif (Hanya label jika status "Selesai") */}
                        {ticket.status === "Selesai" && (
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                            Pekerjaan Selesai
                          </span>
                        )}

                        {/* Aksi 4: Hapus Tiket (Selalu tersedia) */}
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="cursor-pointer p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Dokumen Tiket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* FOOTER TABEL: PAGINATION & INFORMASI */}
        <div className="bg-white border-t border-zinc-100 px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Info Baris */}
        <span className="text-[11px] font-medium text-zinc-400">
            Menampilkan <strong className="font-bold text-zinc-700">1-3</strong> dari <strong className="font-bold text-zinc-700">12</strong> tiket aktif
        </span>

        {/* Tombol Navigasi Halaman */}
        <div className="flex items-center gap-1.5">
            <button 
            disabled 
            className="cursor-not-allowed px-3 py-1.5 border border-zinc-150 rounded-xl text-xs font-bold text-zinc-400 bg-zinc-50/50 transition-all"
            >
            Sebelumnya
            </button>
            
            <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold shadow-sm">
                1
            </button>
            <button className="px-3 py-1.5 hover:bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold transition-all">
                2
            </button>
            <button className="px-3 py-1.5 hover:bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold transition-all">
                3
            </button>
            </div>

            <button 
            className="cursor-pointer px-3 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-600 transition-all active:scale-[0.98]"
            >
            Berikutnya
            </button>
        </div>
        </div>
        </div>
      </div>

    </div>
  );
}