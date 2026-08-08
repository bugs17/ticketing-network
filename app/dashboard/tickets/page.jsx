"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Plus, 
  Search,
  Eye, 
} from "lucide-react";

import CreateTicketManual from "@/components/dashboard/modal/create-ticket-manual";
import { listOpd } from "@/app/actions/get-list-opd";
import { listTicket } from "@/app/actions/get-list-ticket";
import ViewTicketModal from "@/components/dashboard/modal/view-ticket-detail";
import DeleteTicketModal from "@/components/dashboard/modal/delete-ticket";

// Utility untuk format tampilan tanggal Indonesia: "08 Agu 2026, 17:41"
const formatDate = (dateInput) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isModalTicketOpen, setIsModalTicketOpen] = useState(false);
  const [opdList, setOpdList] = useState([]);

  // State Pencarian dan Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMonth, setFilterMonth] = useState("ALL");
  const [filterYear, setFilterYear] = useState("ALL");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deletingTicketId, setDeletingTicketId] = useState(null); // Modal Delete (menyimpan ID tiket)

  // Fetch List OPD untuk Modal
  useEffect(() => {
    const getOpdList = async () => {
      const { data, success } = await listOpd();
      if (success && data) {
        setOpdList(data);
      }
    };
    getOpdList();
  }, []);

  // Fetch List Tiket dari Server Actions
  useEffect(() => {
    const getListTicket = async () => {
      const { data, success } = await listTicket();
      if (success && data) {
        setTickets(data);
      }
    };
    getListTicket();
  }, []);


  // Logika Filter Gabungan (Search + Status + Bulan + Tahun)
  const filteredTickets = tickets.filter((ticket) => {
    // 1. Filter Pencarian Teks (Case Insensitive)
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      `TCK-${ticket.id}`.toLowerCase().includes(query) ||
      (ticket.opd?.nama || "").toLowerCase().includes(query) ||
      (ticket.deskripsi_masalah || "").toLowerCase().includes(query);

    // 2. Filter Status (Sensitif huruf kecil sesuai Schema)
    const matchesStatus =
      filterStatus === "ALL" ||
      ticket.status?.toLowerCase() === filterStatus.toLowerCase();

    // Parse objek Date dari Prisma / SQLite
    const createdDate = ticket.createdAt ? new Date(ticket.createdAt) : null;
    const isValidDate = createdDate && !isNaN(createdDate.getTime());

    // Format Bulan dua digit: "01", "02", ..., "12"
    const ticketMonth = isValidDate
      ? String(createdDate.getMonth() + 1).padStart(2, "0")
      : "ALL";

    // Format Tahun empat digit: "2026"
    const ticketYear = isValidDate
      ? String(createdDate.getFullYear())
      : "ALL";

    // 3. Filter Bulan
    const matchesMonth =
      filterMonth === "ALL" || ticketMonth === filterMonth;

    // 4. Filter Tahun
    const matchesYear =
      filterYear === "ALL" || ticketYear === filterYear;

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

        <button 
          onClick={() => setIsModalTicketOpen(true)}
          className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Tiket Manual
        </button>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
        
        {/* Input Pencarian */}
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

        {/* Filter Status */}
        <div className="lg:col-span-2 w-full">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:border-zinc-950 transition-colors cursor-pointer appearance-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* Filter Bulan */}
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

        {/* Filter Tahun */}
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

      {/* 3. TABEL TIKET */}
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
                        TCK-{ticket.id}
                      </span>
                    </td>

                    {/* OPD */}
                    <td className="p-4">
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-zinc-900 block">
                          {ticket.opd?.nama || "OPD Tidak Ditemukan"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Deskripsi */}
                    <td className="p-4 max-w-[280px]">
                      <p className="text-xs font-medium text-zinc-600 line-clamp-2" title={ticket.deskripsi_masalah || "-"}>
                        {ticket.deskripsi_masalah || "-"}
                      </p>
                      {ticket.opd?.kontak_pic && (
                        <span className="text-[9px] text-zinc-400 block mt-1">
                          Kontak: {ticket.opd.kontak_pic}
                        </span>
                      )}
                    </td>

                    {/* Prioritas */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-md uppercase ${
                        ticket.opd?.prioritas === "high" 
                          ? "bg-red-50 text-red-700 border border-red-100" 
                          : ticket.opd?.prioritas === "medium" 
                          ? "bg-amber-50 text-amber-700 border border-amber-100" 
                          : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {ticket.opd?.prioritas || "LOW"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        ticket.status === "menunggu" 
                          ? "bg-amber-50 text-amber-700" 
                          : ticket.status === "proses" 
                          ? "bg-blue-50 text-blue-700" 
                          : "bg-emerald-50 text-emerald-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ticket.status === "menunggu" 
                            ? "bg-amber-500" 
                            : ticket.status === "proses" 
                            ? "bg-blue-500 animate-pulse" 
                            : "bg-emerald-500"
                        }`} />
                        {ticket.status}
                      </span>
                    </td>

                    {/* Aksi Kontrol */}
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Tombol Lihat Detail */}
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="cursor-pointer p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Lihat Detail Tiket"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setDeletingTicketId(ticket.id)}
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

          {/* FOOTER TABEL */}
          <div className="bg-white border-t border-zinc-100 px-4 py-3.5 flex items-center justify-between gap-4">
            <span className="text-[11px] font-medium text-zinc-400">
              Menampilkan <strong className="font-bold text-zinc-700">{filteredTickets.length}</strong> dari <strong className="font-bold text-zinc-700">{tickets.length}</strong> tiket aktif
            </span>
          </div>
        </div>
      </div>

      <ViewTicketModal 
        ticket={selectedTicket} 
        isOpen={!!selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
      />

      <DeleteTicketModal
        isOpen={!!deletingTicketId}
        ticketId={deletingTicketId}
        onClose={() => setDeletingTicketId(null)}
        setTickets={setTickets}

      />

      <CreateTicketManual 
        isModalTicketOpen={isModalTicketOpen} 
        setIsModalTicketOpen={setIsModalTicketOpen} 
        opdList={opdList} 
        setTicketList={setTickets}
      />

    </div>
  );
}