"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Search, Clock, CheckCircle2, AlertCircle, HardDrive, User, ArrowRight } from "lucide-react";

const TrackDrawer = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l border-zinc-100 p-6 flex flex-col justify-between">
        
        <div className="space-y-6">
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" /> Pantau Tiket Aduan
            </SheetTitle>
            <SheetDescription className="text-zinc-500 text-xs">
              Masukkan ID Tiket Anda untuk melihat progres penanganan gangguan oleh tim teknis DISKOMINFO.
            </SheetDescription>
          </SheetHeader>

          {/* Input Pencarian Kode Tiket */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input placeholder="Contoh: TCK-2026-0982" className="pl-9 border-zinc-200 bg-zinc-50/50 focus-visible:ring-emerald-500" />
            </div>
            <Button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs px-4">Cari</Button>
          </div>

          <div className="h-px bg-zinc-100 my-2"></div>

          {/* Hasil Pengecekan / Detail Tiket (Simulasi Data Terbuka) */}
          <div className="space-y-5">
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-500">TCK-2026-0412</span>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 shadow-none text-[10px] font-medium px-2 py-0.5">
                  Progres Perbaikan
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-zinc-900">BAPPEDA — Putus Koneksi FO Utama</h4>
              <p className="text-[11px] text-zinc-500">Dilaporkan: Hari ini, 14:20 WIT</p>
            </div>

            {/* Timeline Progres Status */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
              
              {/* Step 3: Progres Aktif */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    Tim Lapangan Menuju Lokasi <Clock className="w-3 h-3 text-zinc-400" />
                  </h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    Tim Infra Bidang ICT sedang melakukan tracing kabel di area Box FO luar gedung.
                  </p>
                  <span className="text-[9px] font-mono text-zinc-400 block mt-1">15:05 WIT • Oleh: Regu B</span>
                </div>
              </div>

              {/* Step 2: Selesai */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 bg-white" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-zinc-800">Tiket Diterima & Didisposisikan</h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Laporan diverifikasi oleh Helpdesk DISKOMINFO dan diteruskan ke Tim Penanganan Infrastruktur.
                  </p>
                  <span className="text-[9px] font-mono text-zinc-400 block mt-1">14:35 WIT</span>
                </div>
              </div>

              {/* Step 1: Selesai */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 bg-white" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-zinc-800">Tiket Berhasil Dibuat</h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Tiket masuk ke sistem antrean pusat dari operator BAPPEDA.
                  </p>
                  <span className="text-[9px] font-mono text-zinc-400 block mt-1">14:20 WIT</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bagian Bawah Drawer: Kontak Cepat */}
        <div className="border-t border-zinc-100 pt-4 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Butuh Bantuan Cepat?</span>
          <a href="#" className="text-emerald-600 hover:underline font-semibold flex items-center gap-1">
            Hubungi NOC DISKOMINFO <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default TrackDrawer;