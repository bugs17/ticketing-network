"use client";

import { X, Clock, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const ViewTicketModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 text-sm">Detail Tiket TCK-{ticket.id}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info OPD & Kontak */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Instansi / OPD</p>
              <p className="text-xs font-semibold text-zinc-900 mt-1">{ticket.opd?.nama}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Kontak PIC</p>
              <p className="text-xs font-semibold text-zinc-900 mt-1">{ticket.opd?.kontak_pic || "-"}</p>
            </div>
          </div>

          {/* Status Tracker */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Status Penanganan</p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                ticket.status === "menunggu" ? "bg-amber-50 text-amber-700" :
                ticket.status === "proses" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
              }`}>
                {ticket.status === "menunggu" && <Clock className="w-3.5 h-3.5" />}
                {ticket.status === "proses" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {ticket.status === "selesai" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {ticket.status.toUpperCase()}
              </div>
              <span className="text-[10px] text-zinc-500 italic">
                {ticket.status === "menunggu" ? "Menunggu respon teknisi..." : "Sudah direspon teknisi"}
              </span>
            </div>
          </div>

          {/* Deskripsi Panjang */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Deskripsi Masalah</p>
            <div className="p-4 bg-zinc-50 rounded-xl text-xs text-zinc-700 leading-relaxed border border-zinc-100 min-h-[100px]">
              {ticket.deskripsi_masalah || "Tidak ada deskripsi tambahan."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketModal;