"use client";

import { createNewUser } from '@/app/actions/create-new-user';
import { Users, X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import React, { useState, useTransition } from 'react';

const RegisterNewUser = ({ isRegModalOpen, setIsRegModalOpen, usersList, setUsersList }) => {
  if (!isRegModalOpen) {
    return null;
  }

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const initialFormState = {
    nama: "",
    email: "",
    username: "",
    password: "",
    role: "teknisi",
    isActive: true
  };

  const [newUser, setNewUser] = useState(initialFormState);

  const handleRegisterSubmit = () => {
    setErrorMsg("");

    if (
      !newUser.nama.trim() ||
      !newUser.email.trim() ||
      !newUser.username.trim() ||
      !newUser.password.trim()
    ) {
      setErrorMsg("Mohon lengkapi semua bidang input yang wajib diisi (*).");
      return;
    }

    startTransition(async () => {
      const res = await createNewUser(newUser);
      
      if (!res.success) {
        setErrorMsg(res.error);
        return;
      }

      // Masukkan user baru ke posisi paling atas list
      setUsersList((prev) => [res.data, ...prev]);

      // Reset form & tutup modal
      setNewUser(initialFormState);
      setIsRegModalOpen(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-800 tracking-tight">Daftarkan Pengguna Baru</span>
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
              placeholder="Contoh: Hermawan Wijaya"
              value={newUser.nama}
              onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
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
              placeholder="Contoh: hermawan@gov.id"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
                placeholder="Contoh: hermawan"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
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
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors shadow-sm cursor-pointer"
              >
                <option value="admin">Admin Diskominfo</option>
                <option value="teknisi">Teknisi Lapangan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Status Awal <span className="text-red-500">*</span>
              </label>
              <select
                value={String(newUser.isActive)}
                onChange={(e) =>
                  setNewUser({ ...newUser, isActive: e.target.value === "true" })
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
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isPending ? "Mendaftarkan..." : "Daftarkan User"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegisterNewUser;