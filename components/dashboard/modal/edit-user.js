"use client";

import { editUser } from "@/app/actions/edit-user";
import { Edit2, X, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";

const EditUser = ({ editingUser, setEditingUser, setUsersList, usersList }) => {
  if (editingUser === null) {
    return null;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    setErrorMsg("");
    setEditingUser(null);
  };

  const handleInputChange = (field, value) => {
    if (errorMsg) setErrorMsg("");
    setEditingUser({ ...editingUser, [field]: value });
  };

  const handleEditSubmit = async () => {
    setErrorMsg("");

    // 1. Validasi ID
    if (!editingUser.id) {
      setErrorMsg("ID Pengguna tidak valid atau tidak ditemukan.");
      return;
    }

    // 2. Validasi Input Kosong (Trim spasi)
    const nama = editingUser.nama?.trim() || "";
    const email = editingUser.email?.trim() || "";
    const username = editingUser.username?.trim() || "";
    const password = editingUser.password?.trim() || "";

    if (!nama || !email || !username || !password) {
      setErrorMsg("Semua bidang input (Nama, Email, Username, Password) wajib diisi!");
      return;
    }

    // 3. Validasi Format Email Sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Format alamat email tidak valid!");
      return;
    }

    // Eksekusi Server Action / API Update di sini
   startTransition(async () => {
    const {data, error, success} = await editUser(editingUser)
    if (!success) {
        setErrorMsg(error);
        return;
    }

    // Update item yang ID-nya sama, data lain tetap
    setUsersList((prev) =>
        prev.map((user) => (user.id === data.id ? data : user))
    );

    setEditingUser(null);

   })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Edit2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-800 tracking-tight">Ubah Informasi Pengguna</span>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 bg-zinc-50/30">

          {/* Alert Message Error */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingUser.nama || ""}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
            />
          </div>

          {/* Alamat Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editingUser.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
            />
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editingUser.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={editingUser.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Hak Akses / Role <span className="text-red-500">*</span>
              </label>
              <select
                value={editingUser.role || "teknisi"}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm cursor-pointer"
              >
                <option value="admin">Admin Diskominfo</option>
                <option value="teknisi">Teknisi Lapangan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={String(editingUser.isActive)}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.value === "true")
                }
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm cursor-pointer"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-100 bg-white">
          <button
            type="button"
            disabled={isPending}
            onClick={handleClose}
            className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleEditSubmit}
            className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
            >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{isPending ? "Proses Perubahan" : "Simpan Perubahan"}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default EditUser;