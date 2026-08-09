"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import LoginDialog from "./login-dialog"
import { 
  TicketCheck, 
  LogIn, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  Wrench, 
  ShieldCheck,
  ArrowUpRight,
  UserCheck,
  Loader2
} from "lucide-react"
import { getLandingStats } from "@/app/actions/landing-stats"
import Image from "next/image"

export default function LandingPage() {
  const [stats, setStats] = useState({
    tiketTuntasBulanIni: 0,
    tiketDiprosesCount: 0,
    totalTeknisiCount: 0,
    avgMinutes: 0,
    recentTickets: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const res = await getLandingStats()
      if (res.success) {
        setStats(res.data)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    // Container Responsive: Auto scroll untuk mobile, fixed viewport untuk desktop
    <div className="min-h-screen md:h-screen w-screen bg-white text-zinc-900 flex flex-col overflow-y-auto md:overflow-hidden selection:bg-[#372aac]/20 relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-zinc-100 bg-white/95 backdrop-blur-sm z-50 shrink-0 sticky top-0 md:relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left Section: Branding & Logo */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Container Logo Horizontal */}
            <div className="relative h-8 sm:h-9 w-auto max-w-[180px] sm:max-w-[220px] shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Logo Diskominfo Mimika"
                width={220}
                height={40}
                className="h-full w-auto object-contain object-left"
                priority
              />
            </div>

            {/* Divider Pemisah Halus */}
            <div className="h-6 w-px bg-zinc-200 shrink-0 hidden sm:block"></div>

            {/* Teks Nama Aplikasi (NetTick) */}
            <div className="shrink-0">
              <span className="font-bold tracking-tight block text-sm sm:text-base text-zinc-950 leading-none">
                Helpdesk <span className="font-medium text-zinc-400">Ticketing System</span>
              </span>
              <span className="text-[9px] text-zinc-400 block mt-0.5 font-medium tracking-wider uppercase">
                Kabupaten Mimika
              </span>
            </div>
          </div>

          {/* Right Section: Navigation & Login */}
          <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Badge 
              variant="secondary" 
              className="hidden sm:flex bg-[#372aac]/10 text-[#372aac] border border-[#372aac]/20 font-medium text-xs px-3 py-1 items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#372aac] animate-pulse"></span>
              <span>Layanan Aktif</span>
            </Badge>
            
            <div className="h-4 w-px bg-zinc-200"></div>

            <LoginDialog>
              <span className="cursor-pointer bg-zinc-950 hover:bg-[#372aac] text-white text-xs font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 sm:gap-2">
                <LogIn className="w-3.5 h-3.5" /> 
                <span>Masuk</span>
              </span>
            </LoginDialog>
          </nav>
        </div>
      </header>

      {/* 2. Main Hero Section */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 py-6 md:py-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Kolom Kiri: Informasional & Call to Action */}
          <section className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <Badge variant="outline" className="inline-flex items-center gap-2 border-zinc-200 bg-zinc-50 text-zinc-700 px-3 py-1 text-[11px] sm:text-xs font-medium shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Pusat Pelaporan Gangguan Jaringan OPD</span>
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-zinc-950">
              Pengaduan Jaringan OPD <span className="text-[#372aac] block sm:inline">Tercatat & Terukur.</span>
            </h1>

            <p className="text-sm sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Sistem ticketing resmi DISKOMINFO Kabupaten Mimika untuk pencatatan, penugasan teknisi, dan pemantauan penanganan kendala jaringan antardinas.
            </p>

            {/* Rekapitulasi Operasional Bar */}
            <div className="py-3 sm:py-4 border-y border-zinc-100 flex flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 my-2">
              <div className="flex items-center gap-2.5 sm:gap-3 text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#372aac]/10 flex items-center justify-center text-[#372aac] border border-[#372aac]/20 shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Tiket Tuntas</span>
                  <span className="block text-sm sm:text-base font-bold text-zinc-950">
                    {loading ? "..." : stats.tiketTuntasBulanIni.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">/Bulan Ini</span>
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-zinc-200"></div>

              <div className="flex items-center gap-2.5 sm:gap-3 text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Rata Penanganan</span>
                  <span className="block text-sm sm:text-base font-bold text-zinc-950">
                    {loading ? "..." : `${stats.avgMinutes} Mnt`} <span className="text-[10px] sm:text-xs font-semibold text-[#372aac]">&lt; SLA</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <LoginDialog>
                <span className="w-full sm:w-auto bg-[#372aac] hover:bg-[#2e2393] cursor-pointer text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm shadow-md shadow-[#372aac]/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]">
                  Masuk Portal Petugas <LogIn className="w-4 h-4 text-indigo-200" />
                </span>
              </LoginDialog>

              <div className="text-center sm:text-left">
                <span className="block text-[11px] sm:text-xs font-semibold text-zinc-800 flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#372aac] shrink-0" /> Khusus Internal Diskominfo & Admin OPD
                </span>
                <span className="block text-[10px] sm:text-[11px] text-zinc-400">Gunakan akun terdaftar untuk memproses laporan</span>
              </div>
            </div>
          </section>

          {/* Kolom Kanan: Real-Time Ticket Activity Panel */}
          <aside className="lg:col-span-5 w-full">
            
            <div className="relative p-[1.5px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-xl sm:shadow-2xl shadow-zinc-200/80">
              
              {/* Animated Accent Edge (#372aac) */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,#372aac_70%,transparent_100%)] animate-[spin_5s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-[#372aac]/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>

              {/* Main Dark Card Container */}
              <div className="relative bg-zinc-950 text-white rounded-[15px] sm:rounded-[23px] p-4 sm:p-6 space-y-4 sm:space-y-5 z-10">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-zinc-300">
                      Ringkasan Laporan Realtime
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                    {loading && <Loader2 className="w-2.5 h-2.5 animate-spin" />} LIVE
                  </span>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[9px] sm:text-[10px] font-medium uppercase">Tiket Diproses</span>
                      <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {loading ? "..." : `${stats.tiketDiprosesCount} Laporan`}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500">Penanganan berjalan</p>
                  </div>

                  <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[9px] sm:text-[10px] font-medium uppercase">Total Teknisi</span>
                      <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {loading ? "..." : `${stats.totalTeknisiCount} Personel`}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500">Petugas Terdaftar</p>
                  </div>
                </div>

                {/* Recent Activity Log */}
                <div className="space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Log Laporan Terkini
                  </span>

                  <div className="space-y-2 text-xs">
                    {loading ? (
                      <div className="text-center py-4 text-xs text-zinc-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat data...
                      </div>
                    ) : stats.recentTickets.length === 0 ? (
                      <div className="text-center py-4 text-xs text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                        Belum ada aktivitas laporan terkini.
                      </div>
                    ) : (
                      stats.recentTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-zinc-900/50 border border-zinc-800/50 p-2.5 rounded-xl flex items-start justify-between gap-2.5">
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                ticket.status === 'selesai' ? 'bg-indigo-400' :
                                ticket.status === 'proses' ? 'bg-amber-400' : 'bg-blue-400'
                              }`}></span>
                              <span className="font-semibold text-zinc-200 text-xs truncate">
                                {ticket.opdNama}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight truncate">
                              {ticket.deskripsi}
                            </p>
                          </div>
                          <span className={`text-[9px] font-mono shrink-0 bg-zinc-900 px-1.5 py-0.5 rounded capitalize ${
                            ticket.status === 'selesai' ? 'text-indigo-400' :
                            ticket.status === 'proses' ? 'text-amber-400' : 'text-zinc-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-500 font-mono">
                  <span>Scan QR Code OPD</span>
                  <span className="flex items-center gap-1 text-indigo-400 font-sans font-medium">
                    Sistem Siap <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50/50 py-3 sm:py-3.5 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">
            &copy; 2026 Government of Mimika Regency. DISKOMINFO.
          </p>
          <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono text-zinc-400">
            <span>SLA Target: 99.8%</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#372aac] animate-pulse"></div>
            <span>Internal Access</span>
          </div>
        </div>
      </footer>
    </div>
  )
}