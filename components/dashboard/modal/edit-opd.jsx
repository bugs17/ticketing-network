"use client";

import { editOpd } from "@/app/actions/edit-opd";
import { AlertCircle, Loader2, Pencil, X } from "lucide-react";
import { useState, useTransition } from "react";

const generateToken = (name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}-noc-token-${randomNum}`;
};

const EditOpd = ({ editingOpd, setEditingOpd, setOpdList }) => {
  if (!editingOpd) {
    return null;
  }

  const [errorMsg, setErrorMsg] = useState("");
  const [newOpd, setNewOpd] = useState({ ...editingOpd });
  const [isPending, startTransition] = useTransition();

  // Deteksi apakah nama OPD berubah dari data awal
  const isNameChanged = newOpd.nama.trim().toLowerCase() !== editingOpd.nama?.trim().toLowerCase();

  const handleEdit = () => {
    setErrorMsg("");

    if (!newOpd.nama.trim()) {
      setErrorMsg("Nama Instansi / OPD wajib diisi.");
      return;
    }

    startTransition(async () => {
      // Jika nama berubah, hasilkan token QR baru. Jika tidak, pakai token yang sudah ada.
      const payload = {
        ...newOpd,
        token_qr: isNameChanged
          ? generateToken(newOpd.nama)
          : editingOpd.token_qr,
      };

      const { data, error, success } = await editOpd(payload);

      if (!success) {
        setErrorMsg(error || "Gagal memperbarui data OPD.");
        return;
      }

      // Update state list OPD secara realtime jika dipass
      if (setOpdList && data) {
        setOpdList((prev) =>
          prev.map((item) => (item.id === data.id ? data : item))
        );
      }

      // Tutup modal
      setEditingOpd(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-800 tracking-tight">
              Ubah Informasi OPD
            </span>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setEditingOpd(null)}
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
                value={newOpd.nama_pic || ""}
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
                value={newOpd.kontak_pic || ""}
                onChange={(e) => setNewOpd({ ...newOpd, kontak_pic: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Urgensi / Prioritas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Urgensi Tiket
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["low", "medium", "high"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setNewOpd({ ...newOpd, prioritas: lvl })}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    newOpd.prioritas === lvl
                      ? "bg-zinc-950 border-zinc-950 text-white shadow-sm"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Warning Card - Hanya muncul ketika Nama Instansi diubah */}
          {isNameChanged && (
            <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-[10px] text-amber-800 leading-relaxed flex gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Perhatian:</strong> Mengubah nama instansi akan memicu regenerasi token QR baru secara otomatis. Token QR lama tidak akan berfungsi dan Anda **wajib mencetak ulang stiker QR** untuk lokasi ini.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-100 bg-white">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setEditingOpd(null)}
            className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleEdit}
            className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditOpd;