"use client";

import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserProfile, logoutAction } from "@/app/actions/auth";

const Header = ({ propUser }) => {
  const router = useRouter();
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);

  useEffect(() => {
    if (!propUser) {
      async function loadUser() {
        try {
          const data = await getUserProfile();
          
          if (data) setUser(data);
        } catch (err) {
          console.error("Gagal mengambil profil:", err);
        } finally {
          setLoading(false);
        }
      }
      loadUser();
    }
  }, [propUser]);

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res?.success) {
      router.push("/");
      router.refresh();
    }
  };

  const getInitials = (name) => {
    if (!name) return "TK";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-zinc-150 px-4 py-3.5 flex items-center justify-between z-30 shadow-sm">
      <div className="flex items-center gap-3">
        {loading ? (
          /* SKELETON AVATAR & TEXT SAAT LOADING */
          <>
            <div className="w-9 h-9 rounded-full bg-zinc-200 animate-pulse shrink-0" />
            <div className="space-y-1">
              <div className="w-16 h-2.5 bg-zinc-200 animate-pulse rounded" />
              <div className="w-24 h-3.5 bg-zinc-200 animate-pulse rounded" />
            </div>
          </>
        ) : (
          /* PROFILE TAMPIL SETELAH READY */
          <>
            <div className="w-9 h-9 rounded-full bg-zinc-950 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {getInitials(user?.nama)}
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                {user?.role === "teknisi" ? "Teknisi Lapangan" : user?.role || "Teknisi Lapangan"}
              </span>
              <span className="text-xs font-bold text-zinc-900 block">
                {user?.nama || "Teknisi"}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          title="Keluar"
          className="p-2 text-zinc-400 hover:text-red-600 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;