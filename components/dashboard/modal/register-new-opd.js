"use client";

import React, { useState, useTransition } from "react";
import { Building2, X, Loader2, AlertCircle } from "lucide-react";
// import { createNewOpd } from "@/app/actions/create-new-opd";

const generateToken = (name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}-noc-token-${randomNum}`;
};

const ModalAddNewOpd = ({ isRegModalOpen, setIsRegModalOpen, opdList, setOpdList }) => {
  if (!isRegModalOpen) {
    return null;
  }

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const initialFormState = {
    nama: "",
    nama_pic: "",
    no_hp_pic: "",
  };

  const [newOpd, setNewOpd] = useState(initialFormState);

  const handleRegisterSubmit = () => {
    setErrorMsg("");

    // Validasi field wajib
    if (!newOpd.nama.trim()) {
      setErrorMsg("Nama Instansi / OPD wajib diisi.");
      return;
    }

    startTransition(async () => {
      // Inject token_qr yang dihasilkan dari nama OPD saat submit
      const payload = {
        ...newOpd,
        token_qr: generateToken(newOpd.nama),
      };

      // Panggil Server Action dengan payload yang sudah ada token_qr
    //   const res = await createNewOpd(payload);

    //   if (!res?.success) {
    //     setErrorMsg(res?.error || "Gagal mendaftarkan OPD baru.");
    //     return;
    //   }

    //   // Update state list OPD secara realtime
    //   if (setOpdList && res.data) {
    //     setOpdList((prev) => [res.data, ...prev]);
    //   }

    //   // Reset form & tutup modal
    //   setNewOpd(initialFormState);
    //   setIsRegModalOpen(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-800 tracking-tight">Registrasi OPD Baru</span>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsRegModalOpen(false)}
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

          {/* Nama Instansi / OPD */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Nama Instansi / OPD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Dinas Sosial (Dinsos)"
              value={newOpd.nama}
              onChange={(e) => setNewOpd({ ...newOpd, nama: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
            />
          </div>

          {/* Nama PIC & Nomor HP PIC */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Nama PIC (Opsional)
              </label>
              <input
                type="text"
                placeholder="Bpk. Heru Darmawan"
                value={newOpd.nama_pic}
                onChange={(e) => setNewOpd({ ...newOpd, nama_pic: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                No. Kontak PIC (Opsional)
              </label>
              <input
                type="text"
                placeholder="081234567890"
                value={newOpd.no_hp_pic}
                onChange={(e) => setNewOpd({ ...newOpd, no_hp_pic: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-zinc-100/70 p-3 rounded-xl border border-zinc-200/50 text-[10px] text-zinc-500 leading-relaxed">
            💡 <strong>Sistem Otomatis:</strong> Token QR pintar unik akan langsung dibentuk secara otomatis oleh sistem saat data ini disimpan agar Anda bisa langsung mencetak stikernya.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-100 bg-white">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsRegModalOpen(false)}
            className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleRegisterSubmit}
            className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Menyimpan..." : "Simpan & Daftarkan"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalAddNewOpd;