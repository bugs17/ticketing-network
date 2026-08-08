"use client";

import { getActiveTickets } from "@/app/actions/get-active-tickets";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  UserCheck,
  UserX,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ViewDetailTicketActive from "../modal/view-detail-ticket-active";

// Helper Format Waktu Relatif Ringkas
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes}m yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}j yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}h yang lalu`;
};

const TicketActive = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const res = await getActiveTickets();
      if (res.success && res.data) {
        setTickets(res.data);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <>
      {/* Container List Tiket */}
      <div className="overflow-y-auto pr-2 max-h-[380px] space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-200">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Memuat tiket aktif...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-100 p-6">
            Tidak ada tiket aktif saat ini.
          </div>
        ) : (
          tickets.map((ticket) => {
            const priority = (ticket.opd?.prioritas || "medium").toUpperCase();

            return (
              <div
                key={ticket.id}
                className="relative bg-white border border-zinc-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Detail Aksen Sobekan Tiket (Kiri & Kanan) */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full bg-zinc-50 border-r border-zinc-150 z-10" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rounded-full bg-zinc-50 border-l border-zinc-150 z-10" />

                {/* 1. Header Tiket */}
                <div className="p-4 pb-3 border-b border-dashed border-zinc-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md tracking-wider">
                      TCK-{ticket.id}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-tight">
                      {formatRelativeTime(ticket.createdAt)}
                    </span>
                  </div>

                  {/* Priority Indicator */}
                  <span
                    className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${
                      priority === "HIGH"
                        ? "text-red-600 bg-red-50"
                        : priority === "MEDIUM"
                        ? "text-amber-600 bg-amber-50"
                        : "text-zinc-500 bg-zinc-100"
                    }`}
                  >
                    {priority}
                  </span>
                </div>

                {/* 2. Isi Masalah */}
                <div className="p-4 py-3.5 space-y-2 flex-grow">
                  <div className="leading-tight">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">
                      Pelapor
                    </span>
                    <h4 className="text-xs font-bold text-zinc-800 truncate">
                      {ticket.opd?.nama || "OPD Tidak Teridentifikasi"}
                    </h4>
                  </div>

                  <div className="leading-normal">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">
                      Deskripsi Masalah
                    </span>
                    <p className="text-sm font-medium text-zinc-950 line-clamp-2">
                      {ticket.deskripsi_masalah || "Tidak ada deskripsi masalah."}
                    </p>
                  </div>
                </div>

                {/* 3. Aksi Tiket */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] text-center shadow-md shadow-zinc-200"
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL DETAIL TIKET                         */}
      {/* ========================================== */}
      <ViewDetailTicketActive selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} />
    </>
  );
};

export default TicketActive;