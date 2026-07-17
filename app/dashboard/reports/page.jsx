"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  ChevronRight,
  Building,
  User,
  X,
  Camera,
  AlertCircle,
  Check,
  ShieldCheck
} from "lucide-react";

// Mock Data Laporan Ringkasan
const summaryStats = [
  {
    label: "Total Tiket Masuk",
    value: "342",
    change: "+12% dari bulan lalu",
    icon: FileText,
  },
  {
    label: "Selesai Tepat Waktu",
    value: "94.2%",
    change: "Target minimal: 90%",
    icon: CheckCircle2,
  },
  {
    label: "Rata-rata Durasi Resolusi",
    value: "42 mnt",
    change: "-8 mnt lebih cepat",
    icon: Clock,
  },
  {
    label: "SLA Terlampaui",
    value: "5 tiket",
    change: "Turun dari 12 tiket",
    icon: AlertTriangle,
  }
];

// Mock Data Distribusi Masalah berdasarkan OPD
const topOPDIncidents = [
  { rank: 1, name: "Dinas Kesehatan", count: 48, percentage: 85, trend: "stabil" },
  { rank: 2, name: "Bappeda", count: 32, percentage: 60, trend: "turun" },
  { rank: 3, name: "Dinas Pendidikan", count: 29, percentage: 55, trend: "naik" },
  { rank: 4, name: "Kecamatan Klojen", count: 18, percentage: 35, trend: "stabil" },
  { rank: 5, name: "Dispendukcapil", count: 15, percentage: 28, trend: "turun" }
];

// Mock Data Kinerja Teknisi Teratas
const technicianPerformance = [
  { name: "Rian Hidayat", ticketsResolved: 114, avgTime: "31 mnt", rating: "4.9/5" },
  { name: "Faris Pratama", ticketsResolved: 92, avgTime: "45 mnt", rating: "4.8/5" },
  { name: "Ahmad Sandi", ticketsResolved: 45, avgTime: "28 mnt", rating: "4.7/5" }
];

// Mock Data Tiket SLA & Evidence Detail untuk Audit BPK
const mockSlaTickets = [
  {
    id: "TK-9801",
    opd: "Dinas Kesehatan (Gedung A)",
    category: "Penyambungan Kabel Fiber Optic (Core 3 & 4)",
    priority: "Kritis",
    priorityColor: "bg-red-55 text-red-600 border-red-100",
    duration: "14 menit",
    slaStatus: "Terpenuhi (SLA 30m)",
    isSlaOk: true,
    technician: "Rian Hidayat",
    date: "14 Juli 2026, 09:42 WIB",
    totalDuration: "28 Menit total pengerjaan",
    images: {
      before: {
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
        notes: "Kabel FO Core 3 putus akibat tarikan dahan pohon di sisi gerbang masuk utama.",
        timestamp: "09:15 WIB"
      },
      after: {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        notes: "Splicing ulang Core 3 selesai, proteksi menggunakan joint closure box, redaman -18.2 dBm (Normal).",
        timestamp: "09:40 WIB"
      }
    }
  },
  {
    id: "TK-9754",
    opd: "Badan Perencanaan Pembangunan Daerah (Bappeda)",
    category: "Optimalisasi Jalur Routing MikroTik",
    priority: "Rendah",
    priorityColor: "bg-zinc-50 text-zinc-600 border-zinc-200",
    duration: "45 menit",
    slaStatus: "Terpenuhi (SLA 240m)",
    isSlaOk: true,
    technician: "Faris Pratama",
    date: "12 Juli 2026, 14:10 WIB",
    totalDuration: "50 Menit total pengerjaan",
    images: {
      before: {
        url: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=600&q=80",
        notes: "Terjadi penumpukan paket IP (packet drop) akibat loop back di switch unmanaged lantai 2.",
        timestamp: "13:30 WIB"
      },
      after: {
        url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
        notes: "Konfigurasi STP diaktifkan di sisi Core, switch loop dibersihkan, bandwidth stabil 100 Mbps.",
        timestamp: "14:05 WIB"
      }
    }
  },
  {
    id: "TK-9712",
    opd: "Dinas Pendidikan",
    category: "Server Hosting Down (Virtual Environment)",
    priority: "Tinggi",
    priorityColor: "bg-amber-50 text-amber-600 border-amber-100",
    duration: "124 menit",
    slaStatus: "Terlampaui (SLA 120m)",
    isSlaOk: false,
    technician: "Ahmad Sandi",
    date: "10 Juli 2026, 11:15 WIB",
    totalDuration: "135 Menit total pengerjaan",
    images: {
      before: {
        url: "https://images.unsplash.com/photo-1600132806608-231446b2e7af?auto=format&fit=crop&w=600&q=80",
        notes: "Volume Proxmox penuh, VM utama database e-Rapor terkunci secara otomatis.",
        timestamp: "09:05 WIB"
      },
      after: {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        notes: "Pembersihan log lama, migrasi storage sisa ke disk cadangan, VM berhasil di-start kembali.",
        timestamp: "11:10 WIB"
      }
    }
  }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Bulan Ini");
  const [isExporting, setIsExporting] = useState(false);
  
  // State untuk melacak tiket mana yang sedang dibuka di Drawer Samping
  const [selectedTicketForAudit, setSelectedTicketForAudit] = useState(null);

  // Menutup Drawer saat menekan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedTicketForAudit(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Laporan format ${format.toUpperCase()} berhasil diekspor.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Analitik & Laporan</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Pantau performa layanan jaringan, beban kerja teknisi, dan performa SLA secara real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative inline-block">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="cursor-pointer appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none hover:border-zinc-300 transition-colors"
            >
              <option>Hari Ini</option>
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative group">
            <button className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]">
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Memproses..." : "Ekspor Data"}
            </button>
            <div className="absolute right-0 mt-1 w-38 bg-white border border-zinc-150 rounded-xl shadow-lg py-1 z-20 hidden group-hover:block hover:block">
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Unduh CSV (.csv)
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Unduh PDF (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                <div className="w-7 h-7 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500">
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold tracking-tight text-zinc-950">{stat.value}</span>
                <span className="text-[10px] text-zinc-500 block font-medium">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-950">OPD Teraktif (Laporan Kendala)</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Daftar instansi dengan frekuensi penanganan gangguan tertinggi.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
            <Building className="w-3 h-3" />
            OPD Level
          </span>
        </div>

        <div className="space-y-4">
          {topOPDIncidents.map((opd) => (
            <div key={opd.rank} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-400">#{opd.rank}</span>
                  <span className="font-bold text-zinc-800">{opd.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-900">{opd.count} Tiket</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    opd.trend === "naik" ? "bg-red-50 text-red-600" :
                    opd.trend === "turun" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-500"
                  }`}>
                    {opd.trend === "naik" ? "↑ Naik" : opd.trend === "turun" ? "↓ Turun" : "• Stabil"}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-950 rounded-full transition-all" 
                  style={{ width: `${opd.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKETS LOG PREVIEW FOR SLA & AUDIT */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-950">Kelayakan Dokumen Bukti & SLA (Bulan Ini)</h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">Klik pada baris tiket untuk membuka Drawer Bukti Foto *Before / After* untuk audit BPK.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
                <th className="p-3 font-mono">ID TIKET</th>
                <th className="p-3">Instansi Pelapor</th>
                <th className="p-3">Kategori Masalah</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Respons SLA</th>
                <th className="p-3 text-right">Aksi Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mockSlaTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => setSelectedTicketForAudit(ticket)}
                  className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                >
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-zinc-500 group-hover:text-zinc-900">{ticket.id}</span>
                  </td>
                  <td className="p-3 font-bold text-zinc-800">{ticket.opd}</td>
                  <td className="p-3 text-zinc-500">{ticket.category}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${ticket.priorityColor}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-500 font-mono">{ticket.duration}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className="cursor-pointer text-[11px] font-bold text-zinc-500 group-hover:text-zinc-950 group-hover:underline inline-flex items-center gap-1 transition-all">
                      Periksa Bukti Foto
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BACKDROP & SLIDE-OVER DRAWER (BUKTI AUDIT FISIK BPK) */}
      <div 
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
          selectedTicketForAudit ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setSelectedTicketForAudit(null)}
          className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${
            selectedTicketForAudit ? "opacity-30 backdrop-blur-sm" : "opacity-0"
          }`}
        />

        {/* Drawer Container */}
        <div className="absolute inset-y-0 right-0 max-w-xl w-full flex pl-10">
          <div 
            className={`w-full bg-white shadow-2xl border-l border-zinc-100 flex flex-col justify-between transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
              selectedTicketForAudit ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedTicketForAudit && (
              <>
                {/* DRAWER HEADER */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-zinc-100 text-zinc-800 rounded-md">
                        {selectedTicketForAudit.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Audit-Ready BPK
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 leading-tight">
                      {selectedTicketForAudit.opd}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedTicketForAudit(null)}
                    className="cursor-pointer p-1.5 text-zinc-400 hover:text-zinc-950 rounded-xl hover:bg-zinc-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* DRAWER BODY (Scrollable content) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  
                  {/* METADATA TEKNISI & PEKERJAAN */}
                  <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-150/70 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Teknisi Lapangan</span>
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        {selectedTicketForAudit.technician}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Waktu Penanganan</span>
                      <span className="font-bold text-zinc-800 text-[11px]">
                        {selectedTicketForAudit.date}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-zinc-200/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Deskripsi Tugas</span>
                      <span className="font-medium text-zinc-700">{selectedTicketForAudit.category}</span>
                    </div>
                  </div>

                  {/* FOTO BEFORE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Sebelum Perbaikan (Before)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {selectedTicketForAudit.images.before.timestamp}
                      </span>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                      <img 
                        src={selectedTicketForAudit.images.before.url} 
                        alt="Kondisi Sebelum" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images.before.notes}
                    </p>
                  </div>

                  {/* FOTO AFTER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="w-3.5 h-3.5 animate-pulse" />
                        Setelah Perbaikan (After)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {selectedTicketForAudit.images.after.timestamp}
                      </span>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                      <img 
                        src={selectedTicketForAudit.images.after.url} 
                        alt="Kondisi Setelah" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images.after.notes}
                    </p>
                  </div>

                </div>

                {/* DRAWER FOOTER (ACTIONS) */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedTicketForAudit(null)}
                    className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-3 px-4 rounded-xl transition-all text-center"
                  >
                    Tutup Panel
                  </button>
                  <button 
                    onClick={() => alert(`Sistem menyiapkan berkas ekspor PDF khusus untuk ${selectedTicketForAudit.id}`)}
                    className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor Bukti Fisik
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}