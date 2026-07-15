"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginDialog from "./login-dialog"
import TrackDrawer from "./track-drawer"
import { ArrowRight, TicketCheck, LogIn, MapPin, Zap, Building2, CheckCircle2, Clock, Smartphone} from "lucide-react"


export default function LandingPage() {
  return (
    // Container Utama: Full Screen Height (h-screen) dan Overflow Hidden agar tidak bisa di-scroll
    <div className="h-screen w-screen bg-white text-zinc-900 flex flex-col overflow-hidden selection:bg-emerald-100 relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* 1. Header/Navigation */}
      <header className="border-b border-zinc-100 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shadow-md shadow-zinc-200">
              <TicketCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tighter block text-base text-zinc-950">NetTick <span className="font-medium text-zinc-500">Mimika</span></span>
              <span className="text-[11px] text-emerald-600 block -mt-0.5 font-semibold tracking-wider">DISKOMINFO KAB. MIMIKA</span>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-medium text-xs px-3 py-1">
              v1.0 Status: Aman
            </Badge>
            <div className="h-4 w-px bg-zinc-200 mx-1"></div>
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 text-xs">
              SOP Pelaporan
            </Button>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section - Centralized and Balanced */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
          
        {/* Kolom Kiri: Pesan Utama */}
        <section className="md:col-span-7 space-y-6 text-center md:text-left">
            <Badge variant="outline" className="inline-flex items-center gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-xs shadow-inner shadow-emerald-100">
                <Building2 className="w-3.5 h-3.5" />
                Sistem Monitoring Jaringan Internal Pemkab Mimika
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.1] text-zinc-950">
                Aduan Gangguan Jaringan <span className="text-emerald-600">Cepat & Terukur.</span>
            </h1>

            <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                Sistem internal DISKOMINFO Mimika untuk pelaporan insiden infrastruktur FO, Intranet, dan Internet bagi seluruh Organisasi Perangkat Daerah.
            </p>

            {/* Indikator Performa & Jumlah Gangguan (Mini Stats Bar) */}
            <div className="py-4 border-y border-zinc-100 flex flex-wrap items-center justify-center md:justify-start gap-8 my-2">
                <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-700 border border-zinc-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <span className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Tiket Direspons</span>
                    <span className="block text-base font-bold text-zinc-950">1,248 <span className="text-xs font-normal text-zinc-500">Bulan Ini</span></span>
                </div>
                </div>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-700 border border-zinc-100">
                    <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <span className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Penyelesaian SLA</span>
                    <span className="block text-base font-bold text-zinc-950">94.2% <span className="text-xs font-normal text-emerald-600 font-semibold">&lt; 2 Jam</span></span>
                </div>
                </div>
            </div>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                <LoginDialog>
                    <Button size="lg" className="bg-zinc-950 cursor-pointer hover:bg-zinc-800 text-white px-8 py-6 rounded-xl font-semibold shadow-lg shadow-zinc-300 flex items-center gap-2.5">
                    Masuk<LogIn className="w-4 h-4 opacity-70" />
                    </Button>
                </LoginDialog>
                <TrackDrawer>
                    <Button size="lg" variant="outline" className="border-zinc-200 cursor-pointer text-zinc-700 hover:bg-zinc-50 px-8 py-6 rounded-xl font-semibold transition-all active:scale-[0.98]">
                    Pantau Status Tiket
                    </Button>
                </TrackDrawer>
            </div>
            </section>

          {/* Kolom Kanan: Quick Ticket Form dengan Border Shine Effect */}
            <aside className="md:col-span-5 flex flex-col items-center md:items-end gap-5 w-full">
  
  {/* 1. CARD UTAMA (FORM TIKET CEPAT) */}
  <div className="relative p-[1px] rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl shadow-zinc-200/60 group">
    
    {/* Efek Cahaya Berputar */}
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,#10b981_70%,transparent_100%)] animate-[spin_5s_linear_infinite] opacity-70" />
    
    {/* Isi Card Utama */}
    <div className="relative bg-white p-7 rounded-[23px] w-full z-10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
        <h3 className="font-bold text-lg text-zinc-950">Buat Tiket Cepat</h3>
        <Zap className="w-5 h-5 text-emerald-500 animate-pulse" />
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="opd" className="text-sm font-semibold text-zinc-800">OPD / Unit Kerja</Label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input id="opd" placeholder="Contoh: BAPPEDA" className="pl-10 pr-4 py-5 border-zinc-200 rounded-lg bg-zinc-50/50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lokasi" className="text-sm font-semibold text-zinc-800">Lokasi Gangguan</Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input id="lokasi" placeholder="Contoh: Lantai 2, Ruang Rapat" className="pl-10 pr-4 py-5 border-zinc-200 rounded-lg bg-zinc-50/50" />
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all duration-200 active:scale-[0.98]">
          Ajukan Laporan <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
    </div>
  </div>

  {/* 2. TOMBOL UNDUH MOBILE (VERTIKAL DI BAWAH CARD, LEBAR SEJAJAR CARD) */}
  <div className="w-full max-w-sm space-y-3 px-1">
    
    {/* Header kecil penanda */}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
        Aplikasi Mobile Internal
      </span>
      <span className="w-12 h-px bg-zinc-100 hidden sm:block"></span>
    </div>

    {/* Grid Tombol Download Berdampingan agar hemat ruang vertikal */}
    <div className="grid grid-cols-2 gap-3">
      {/* Tombol Android (Aktif) */}
      <a 
        href="#" 
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-zinc-200 hover:border-zinc-300 bg-white/80 hover:bg-zinc-50/50 shadow-sm transition-all duration-150 active:scale-[0.97]"
      >
        {/* LOGO ANDROID / PLAYSTORE */}
        <img 
          src="/playstore-logo.png" // Ganti path ini dengan aset logo Android Anda
          alt="Android" 
          className="w-5 h-5 object-contain shrink-0" 
        />
        <div className="text-left leading-none">
          <span className="text-[8px] text-zinc-400 block font-semibold tracking-wider">DOWNLOAD</span>
          <span className="text-xs font-bold text-zinc-800">Android APK</span>
        </div>
      </a>

      {/* Tombol iOS (Coming Soon) */}
      <div 
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 opacity-60 cursor-not-allowed select-none"
        title="Aplikasi iOS sedang dalam tahap peninjauan App Store"
      >
        {/* LOGO APPLE */}
        <img 
          src="/appstore-logo.png" // Ganti path ini dengan aset logo Apple Anda
          alt="iOS" 
          className="w-5 h-5 object-contain shrink-0 grayscale opacity-50" 
        />
        <div className="text-left leading-none">
          <span className="text-[8px] text-zinc-400 block font-semibold tracking-wider">APP STORE</span>
          <span className="text-xs font-semibold text-zinc-400">Coming Soon</span>
        </div>
      </div>
    </div>
  </div>

</aside>

        </div>
      </main>

      {/* 3. Minimal Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50/50 py-4 z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-zinc-500 font-medium">
            &copy; 2026 Pemerintah Kabupaten Mimika. Layanan ini diamankan dan dikelola oleh DISKOMINFO.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
            <span>SLA: 99.8%</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Internal Access</span>
          </div>
        </div>
      </footer>
    </div>
  )
}