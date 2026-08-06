"use client";

import { deleteUser } from "@/app/actions/delete-user";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import React, { useState, useTransition } from "react";

const KonfirmasiDeleteUser = ({
  deletingUser,
  setDeletingUser,
  setUsersList,
  usersList,
}) => {
  if (deletingUser === null) {
    return null;
  }

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleDeleteConfirm = () => {
    setErrorMsg("");

    startTransition(async () => {
      // Pastikan melewatkan ID atau objek sesuai kebutuhan server action Anda
      const res = await deleteUser(deletingUser);

      if (!res?.success) {
        setErrorMsg(res?.error || "Gagal menghapus pengguna.");
        return;
      }

      // Buang user yang terhapus dari state listUser
      setUsersList((prev) => prev.filter((user) => user.id !== deletingUser.id));

      // Tutup modal
      setDeletingUser(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">Hapus Akses Pengguna?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Tindakan ini akan menolak akses masuk bagi <strong>{deletingUser.nama}</strong> ke sistem secara permanen. Riwayat tugas atau tiket yang terselesaikan akan tetap disimpan untuk audit keamanan.
            </p>
          </div>

          {/* Alert jika ada error dari server */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-left animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 border-t border-zinc-100 bg-zinc-50/50">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setDeletingUser(null)}
            className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Batal
          </button>
          
          <button
            type="button"
            disabled={isPending}
            onClick={handleDeleteConfirm}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Menghapus..." : "Ya, Hapus"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default KonfirmasiDeleteUser;