"use client";

import { getSlaAuditTickets } from "@/app/actions/get-sla-audit-tickets";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Download,
  ImageOff,
  Loader2,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const TicketLogSLA = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketForAudit, setSelectedTicketForAudit] = useState(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      const res = await getSlaAuditTickets();
      if (res.success && res.data) {
        setTickets(res.data);
      }
      setLoading(false);
    };

    fetchAuditLogs();
  }, []);

  // Menutup Drawer saat menekan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedTicketForAudit(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* TICKETS LOG PREVIEW FOR SLA & AUDIT */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-950">
            Kelayakan Dokumen Bukti & SLA (Bulan Ini)
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Klik pada baris tiket untuk membuka Drawer Bukti Foto *Before / After* untuk audit BPK.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex items-center justify-center text-zinc-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-medium">Memuat data audit SLA...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200 p-4">
              Belum ada data tiket bulan ini.
            </div>
          ) : (
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
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicketForAudit(ticket)}
                    className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-zinc-500 group-hover:text-zinc-900">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-zinc-800">{ticket.opd}</td>
                    <td className="p-3 text-zinc-500 max-w-xs truncate">
                      {ticket.category}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${ticket.priorityColor}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 font-mono">
                      {ticket.duration}
                    </td>
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
          )}
        </div>
      </div>

      {/* BACKDROP & SLIDE-OVER DRAWER (BUKTI AUDIT FISIK BPK) */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
          selectedTicketForAudit
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
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
                    type="button"
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
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Status SLA
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          selectedTicketForAudit.isSlaOk
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedTicketForAudit.slaStatus}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Waktu Laporan
                      </span>
                      <span className="font-bold text-zinc-800 text-[11px]">
                        {selectedTicketForAudit.date}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-zinc-200/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Deskripsi Kendala
                      </span>
                      <span className="font-medium text-zinc-700 leading-relaxed">
                        {selectedTicketForAudit.category}
                      </span>
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

                    {selectedTicketForAudit.images.before.url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                        <img
                          src={selectedTicketForAudit.images.before.url}
                          alt="Kondisi Sebelum"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
                        <ImageOff className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-[11px] font-medium">
                          Foto Sebelum (Before) belum diunggah
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images.before.notes}
                    </p>
                  </div>

                  {/* FOTO AFTER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        Setelah Perbaikan (After)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {selectedTicketForAudit.images.after.timestamp}
                      </span>
                    </div>

                    {selectedTicketForAudit.images.after.url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                        <img
                          src={selectedTicketForAudit.images.after.url}
                          alt="Kondisi Setelah"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
                        <ImageOff className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-[11px] font-medium">
                          Foto Setelah (After) belum diunggah
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images.after.notes}
                    </p>
                  </div>
                </div>

                {/* DRAWER FOOTER (ACTIONS) */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForAudit(null)}
                    className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-3 px-4 rounded-xl transition-all text-center"
                  >
                    Tutup Panel
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Sistem menyiapkan berkas ekspor PDF khusus untuk ${selectedTicketForAudit.id}`
                      )
                    }
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
    </>
  );
};

export default TicketLogSLA;