"use client";

import React from "react";
import { 
  TicketCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock Data untuk Grafik Tren Tiket (Clean & Minimalist)
const weeklyData = [
  { day: "Sen", tiket: 12 },
  { day: "Sel", tiket: 19 },
  { day: "Rab", tiket: 15 },
  { day: "Kam", tiket: 22 },
  { day: "Jum", tiket: 30 },
  { day: "Sab", tiket: 10 },
  { day: "Min", tiket: 8 },
];

// Mock Data Tiket Terbaru
const recentTickets = [
  {
    id: "TCK-1092",
    opd: "Dinas Kesehatan",
    issue: "Koneksi internet FO utama terputus",
    status: "Menunggu",
    time: "5 menit yang lalu",
    priority: "High"
  },
  {
    id: "TCK-1091",
    opd: "Diskominfo",
    issue: "Sistem Peta Jabatan tidak dapat sinkronisasi database",
    status: "Proses",
    time: "20 menit yang lalu",
    priority: "Medium"
  },
  {
    id: "TCK-1090",
    opd: "Bappeda",
    issue: "Aplikasi internal tidak bisa diakses (Error 502)",
    status: "Selesai",
    time: "1 jam yang lalu",
    priority: "High"
  }
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Selamat datang kembali. Berikut adalah rangkuman aktivitas jaringan hari ini.
          </p>
        </div>
        {/* Status System Badge */}
        <div className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Semua sistem NOC berjalan normal
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menunggu Response</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950 tracking-tight">5</span>
            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">Butuh Tindakan</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sedang Ditangani</span>
            <AlertTriangle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950 tracking-tight">8</span>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">Diperbaiki</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Selesai Hari Ini</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950 tracking-tight">11</span>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">SLA Terpenuhi</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS & RECENT TICKETS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* KIRI: Tren Tiket (3/5 width) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between space-y-6">
  <div className="space-y-4">
    <div>
      <h2 className="text-base font-bold text-zinc-950">Laporan Terbanyak per OPD</h2>
      <p className="text-xs text-zinc-400 mt-0.5">Daftar unit kerja dengan frekuensi aduan tertinggi bulan ini.</p>
    </div>

    {/* List OPD & Progress Bar Minimalis */}
    <div className="space-y-4 pt-2">
      {/* OPD 1 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700">Dinas Kesehatan (Dinkes)</span>
          <span className="font-mono font-bold text-zinc-900">12 Laporan</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-950 rounded-full w-[80%]" />
        </div>
      </div>

      {/* OPD 2 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700">Bappeda</span>
          <span className="font-mono font-bold text-zinc-900">8 Laporan</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-950 rounded-full w-[55%]" />
        </div>
      </div>

      {/* OPD 3 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700">Dinas Pendidikan (Disdik)</span>
          <span className="font-mono font-bold text-zinc-900">5 Laporan</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-950 rounded-full w-[35%]" />
        </div>
      </div>

      {/* OPD 4 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700">Kecamatan Mimika Baru</span>
          <span className="font-mono font-bold text-zinc-900">3 Laporan</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-950 rounded-full w-[20%]" />
        </div>
      </div>
    </div>
  </div>

  {/* Info Tambahan */}
  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 border-t border-zinc-50 pt-4">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
    Data diperbarui secara realtime berdasarkan total database internal.
  </div>
</div>

        {/* KANAN: Tiket Terbaru & Aksi Cepat (2/5 width) */}
<div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between h-full">
  <div className="space-y-4 flex-grow">
    <div className="flex items-center justify-between pb-2 border-b border-zinc-50">
      <div>
        <h2 className="text-base font-bold text-zinc-950">Tiket Aktif</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Daftar laporan masuk yang membutuhkan penanganan.</p>
      </div>
    </div>

    {/* List Tiket dengan Desain Kartu Tiket Fisik & Scrollbar Mandiri */}
    <div className="overflow-y-auto pr-2 max-h-[340px] space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-200">
      {[
        {
          id: "TCK-1092",
          opd: "Dinas Kesehatan",
          issue: "Koneksi internet FO utama terputus",
          status: "Menunggu",
          time: "5m yang lalu",
          priority: "HIGH"
        },
        {
          id: "TCK-1091",
          opd: "Diskominfo",
          issue: "Sistem Peta Jabatan tidak dapat sinkronisasi",
          status: "Proses",
          time: "20m yang lalu",
          priority: "MEDIUM"
        },
        {
          id: "TCK-1090",
          opd: "Bappeda",
          issue: "Aplikasi internal tidak bisa diakses (Error 502)",
          status: "Menunggu",
          time: "1j yang lalu",
          priority: "HIGH"
        },
        {
          id: "TCK-1089",
          opd: "Dinas Pendidikan",
          issue: "Akses Wi-Fi Gedung B mati total",
          status: "Proses",
          time: "2j yang lalu",
          priority: "LOW"
        }
      ].map((ticket) => (
        <div 
          key={ticket.id} 
          className="relative bg-white border border-zinc-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 overflow-hidden flex flex-col"
        >
          {/* Detail Aksen Sobekan Tiket (Kiri & Kanan) */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full bg-zinc-50 border-r border-zinc-150 z-10" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rounded-full bg-zinc-50 border-l border-zinc-150 z-10" />

          {/* 1. Bagian Atas Tiket (Header Tiket) */}
          <div className="p-4 pb-3 border-b border-dashed border-zinc-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Badge ID dengan gaya monospaced tiket militer/stasiun */}
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md tracking-wider">
                {ticket.id}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-tight">
                {ticket.time}
              </span>
            </div>

            {/* Priority Indicator */}
            <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${
              ticket.priority === "HIGH" 
                ? "text-red-600 bg-red-50" 
                : ticket.priority === "MEDIUM" 
                ? "text-amber-600 bg-amber-50" 
                : "text-zinc-500 bg-zinc-100"
            }`}>
              {ticket.priority}
            </span>
          </div>

          {/* 2. Bagian Tengah Tiket (Isi Masalah) */}
          <div className="p-4 py-3.5 space-y-2 flex-grow">
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">Pelapor</span>
              <h4 className="text-xs font-bold text-zinc-800 truncate">{ticket.opd}</h4>
            </div>
            
            <div className="leading-normal">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">Deskripsi Masalah</span>
              <p className="text-sm font-medium text-zinc-950 line-clamp-2">
                {ticket.issue}
              </p>
            </div>
          </div>

          {/* 3. Bagian Bawah Tiket (Aksi Tiket / Barcode Area) */}
          <div className="p-4 pt-0">
            {ticket.status === "Menunggu" ? (
              <button 
                onClick={() => alert(`Mengirim teknisi untuk menyelesaikan ${ticket.id}.`)}
                className="w-full cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] text-center shadow-md shadow-zinc-200"
              >
                Kirim Teknisi
              </button>
            ) : (
              <div className="w-full bg-zinc-50 border border-zinc-100 text-zinc-600 text-[11px] font-semibold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Teknisi menuju lokasi gangguan
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  </div>

  {/* Button Bawah Tetap Statis */}
  <button className="w-full mt-4 py-2.5 border border-zinc-100 hover:border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-950 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 shrink-0">
    Lihat semua tiket
    <ArrowRight className="w-3.5 h-3.5" />
  </button>
</div>

      </div>
    </div>
  );
}