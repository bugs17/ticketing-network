"use client";

import React from "react";
import { 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import StatusGrid from "@/components/dashboard/dashboard/status-grid";
import TopOpdCard from "@/components/dashboard/dashboard/top-opd-chart";
import TicketActive from "@/components/dashboard/dashboard/ticket-active";
import Link from "next/link";


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
          Sistem normal
        </div>
      </div>

      {/* 2. STATS GRID */}
      <StatusGrid />

      {/* 3. CHARTS & RECENT TICKETS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
      {/* KIRI: Tren Tiket (3/5 width) */}
      <TopOpdCard />  

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
    <TicketActive />
  </div>

  {/* Button Bawah Tetap Statis */}
  <Link href={"/dashboard/tickets"} className="w-full mt-4 py-2.5 border border-zinc-100 hover:border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-950 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 shrink-0">
    Lihat semua tiket
    <ArrowRight className="w-3.5 h-3.5" />
  </Link>
</div>

      </div>
    </div>
  );
}