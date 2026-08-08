"use client";

import { deleteTicket } from "@/app/actions/delete-ticket";
import { AlertCircle, AlertTriangle, Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";

const DeleteTicketModal = ({ isOpen, onClose, ticketId, setTickets }) => {
  if (!isOpen) return null;

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = () => {
    setErrorMsg("");

    // Validasi keberadaan ticketId
    if (!ticketId) {
      setErrorMsg("ID Tiket tidak valid atau tidak ditemukan.");
      return;
    }

    startTransition(async () => {
      const { error, success } = await deleteTicket(ticketId);

      if (!success) {
        setErrorMsg(error || "Gagal menghapus tiket.");
        return;
      }

      // Keluarkan tiket yang dihapus dari state list agar UI langsung terbarui
      if (setTickets) {
        setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      }

      // Tutup modal konfirmasi
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-6 flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isPending}
            className="cursor-pointer text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="font-bold text-zinc-900 text-base">Hapus Tiket Ini?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus tiket <span className="font-semibold text-zinc-900">TCK-{ticketId}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {/* Alert Error jika gagal */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer flex-1 py-2.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 rounded-xl transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer flex-1 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Menghapus..." : "Ya, Hapus"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteTicketModal;