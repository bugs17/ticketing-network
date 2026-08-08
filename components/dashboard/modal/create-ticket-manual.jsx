"use client";

import React, { useState, useTransition } from "react";
import { TicketPlus, X, Loader2, AlertCircle } from "lucide-react";
import { createTicketByAdmin } from "@/app/actions/create-ticket-by-admin";
// import { createTicketAction } from "@/app/actions/create-ticket-action";


const CreateTicketManual = ({ isModalTicketOpen, setIsModalTicketOpen, setTicketList, opdList }) => {
  if (!isModalTicketOpen) {
    return null;
  }

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const initialFormState = {
    opdId: "",
    deskripsi_masalah: "",
  };

  const [formState, setFormState] = useState(initialFormState);

  const handleSubmit = () => {
    setErrorMsg("");

    if (!formState.opdId.trim()) {
      setErrorMsg("OPD wajib dipilih.");
      return;
    }

    startTransition(async () => {
      // Panggil Server Action untuk pembuatan tiket manual
      const {data,error,success} = await createTicketByAdmin(formState);

      if (!success) {
        setErrorMsg(error || "Gagal membuat tiket.");
        return;
      }

      // Update state list jika diperlukan
      if (setTicketList && data) {
        setTicketList((prev) => [data, ...prev]);
      }

      // Reset form & tutup tampilan
      setFormState(initialFormState);
      setIsModalTicketOpen(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
              <TicketPlus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-800 tracking-tight">Buat Tiket Aduan Manual</span>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsModalTicketOpen(false)}
            className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 bg-zinc-50/30">

          {/* Alert Error */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

            {/* Pilih Instansi / OPD */}
            <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Pilih Instansi / OPD <span className="text-red-500">*</span>
            </label>

            <select
                value={formState.opdId}
                onChange={(e) => setFormState({ ...formState, opdId: e.target.value })}
                disabled={!opdList || opdList.length === 0}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm text-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
            >
                <option value="" disabled>
                {!opdList || opdList.length === 0
                    ? "-- Belum ada data OPD --"
                    : "-- Pilih Instansi / OPD --"}
                </option>

                {Array.isArray(opdList) &&
                opdList.map((opd) => (
                    <option key={opd.id || opd.nama} value={opd.id}>
                    {opd.nama}
                    </option>
                ))}
            </select>

            {/* Warning tambahan jika data OPD di database masih kosong */}
            {(!opdList || opdList.length === 0) && (
                <p className="text-[10px] text-amber-600 mt-1">
                Belum ada instansi/OPD yang terdaftar. Tambahkan OPD terlebih dahulu.
                </p>
            )}
            </div>

          {/* Detail Deskripsi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Deskripsi Kendala (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan detail permasalahan yang dialami..."
              value={formState.deskripsi_masalah}
              onChange={(e) => setFormState({ ...formState, deskripsi_masalah: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm resize-none"
            />
          </div>

          

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-100 bg-white">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsModalTicketOpen(false)}
            className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Memproses..." : "Buat Tiket"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTicketManual;