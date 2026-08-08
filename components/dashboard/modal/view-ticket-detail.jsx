"use client";

import { X, UserCheck, UserX, CheckCircle2, Building2, Phone } from "lucide-react";

const ViewTicketModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  const status = ticket.status || "menunggu";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-zinc-100 text-zinc-900 rounded-lg">
              TCK-{ticket.id}
            </span>
            <span className="text-xs font-medium text-zinc-400">
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onClose(null)}
            className="cursor-pointer text-zinc-400 hover:text-zinc-900 p-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Penanganan Teknisi */}
          <div className="p-4 rounded-2xl border bg-zinc-50/50 space-y-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              Status Penanganan
            </span>

            {/* STATUS: selesai */}
            {status === "selesai" && (
              <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold">Penanganan Selesai</p>
                  <p className="text-[11px] text-emerald-600/90 mt-0.5">
                    Tiket laporan aduan ini telah selesai ditangani oleh tim teknisi.
                  </p>
                </div>
              </div>
            )}

            {/* STATUS: proses */}
            {status === "proses" && (
              <div className="flex items-center gap-3 text-blue-700 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                <UserCheck className="w-5 h-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-bold">Sedang Ditangani Teknisi</p>
                  <p className="text-[11px] text-blue-600/90 mt-0.5">
                    Teknisi saat ini sedang melakukan perbaikan atau koordinasi di lapangan.
                  </p>
                </div>
              </div>
            )}

            {/* STATUS: menunggu (atau fallback) */}
            {status === "menunggu" && (
              <div className="flex items-center gap-3 text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <UserX className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-xs font-bold">Menunggu Respon Teknisi</p>
                  <p className="text-[11px] text-amber-600/90 mt-0.5">
                    Laporan belum diambil oleh teknisi. Menunggu verifikasi tim lapangan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Informasi Pelapor / OPD */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Informasi OPD
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-zinc-100 bg-white">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase">Nama OPD</span>
                </div>
                <p className="font-bold text-zinc-800">
                  {ticket.opd?.nama || "-"}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-100 bg-white">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase">PIC & Kontak</span>
                </div>
                <p className="font-bold text-zinc-800">
                  {ticket.opd?.nama_pic || "-"}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {ticket.opd?.kontak_pic || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi Masalah */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
              Rincian Masalah
            </h4>
            <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50 text-xs text-zinc-800 leading-relaxed font-medium">
              {ticket.deskripsi_masalah || "Tidak ada deskripsi detail."}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose(null)}
            className="cursor-pointer py-2 px-4 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketModal;