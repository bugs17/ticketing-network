"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  Wrench, 
  UserCheck, 
  UserX,
  Mail,
  Lock,
  Check,
  ChevronDown
} from "lucide-react";
import { getListUser } from "@/app/actions/getListUser";
import RegisterNewUser from "@/components/dashboard/modal/register-new-user";
import EditUser from "@/components/dashboard/modal/edit-user";
import KonfirmasiDeleteUser from "@/components/dashboard/modal/konfirmasi-delete-user";

// Mock Data Awal Pengguna Sistem
const initialUsersList = [
  {
    id: "USR-001",
    name: "Ahmad Sandi",
    email: "sandi.diskominfo@gov.id",
    role: "Admin Diskominfo", // Supervison, konfigurasi OPD & QR
    status: "Aktif",
    assignedArea: "Gedung Utama (NOC)",
    lastActive: "Baru saja"
  },
  {
    id: "USR-002",
    name: "Rian Hidayat",
    email: "rian.tech@nettick.com",
    role: "Teknisi Lapangan", // Eksekutor tiket di lokasi OPD
    status: "Aktif",
    assignedArea: "Sektor Barat & Utara",
    lastActive: "2 jam yang lalu"
  },
  {
    id: "USR-003",
    name: "Putri Amalia",
    email: "putri.amalia@gov.id",
    role: "Admin Diskominfo",
    status: "Aktif",
    assignedArea: "Gedung B & C",
    lastActive: "1 hari yang lalu"
  },
  {
    id: "USR-004",
    name: "Faris Pratama",
    email: "faris.p@nettick.com",
    role: "Teknisi Lapangan",
    status: "Nonaktif",
    assignedArea: "Sektor Selatan",
    lastActive: "3 minggu yang lalu"
  }
];


const roleLabels = {
  Semua: "Semua",
  admin: "Admin Diskominfo",
  teknisi: "Teknisi Lapangan",
};

export default function UsersPage() {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("Semua");
  
  // State Dialog & Menu
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, user }
  const [activeDropdown, setActiveDropdown] = useState(null); // User ID

  // State Form User Baru
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Teknisi Lapangan",
    assignedArea: "",
    status: "Aktif"
  });

  // Event Listener Klik Luar untuk menutup Dropdown/Context Menu
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu(null);
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // getUserListfrombackend
  useEffect(() => {
    const getUserFromAction = async () => {
      const {success, error, data} = await getListUser();
      if (success) {
        setUsersList(data)
      }
    }
    getUserFromAction()
  },[])

  // Filter Data Pengguna
  const filteredUsers = usersList.filter(user => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = 
      (user.nama?.toLowerCase().includes(query) ?? false) ||
      (user.email?.toLowerCase().includes(query) ?? false);
    
    const matchesRole = 
      selectedRoleFilter === "Semua" || 
      user.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Submit Registrasi User Baru
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const nextIdNum = usersList.length > 0 
      ? Math.max(...usersList.map(u => parseInt(u.id.replace("USR-", "")))) + 1 
      : 1;
    const generatedId = `USR-${String(nextIdNum).padStart(3, '0')}`;

    const newUserData = {
      id: generatedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      assignedArea: newUser.assignedArea || "Semua Area",
      lastActive: "Belum pernah aktif"
    };

    setUsersList([newUserData, ...usersList]);
    setIsRegModalOpen(false);
    setNewUser({ name: "", email: "", role: "Teknisi Lapangan", assignedArea: "", status: "Aktif" });
  };

  // Submit Edit User
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) return;

    setUsersList(usersList.map(user => 
      user.id === editingUser.id ? { ...editingUser } : user
    ));
    setEditingUser(null);
  };

  // Konfirmasi Hapus
  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    setUsersList(usersList.filter(user => user.id !== deletingUser.id));
    setDeletingUser(null);
  };

  // Klik Kanan Handler
  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      user: user
    });
    setActiveDropdown(null);
  };

  // Helper untuk render badge role
  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-950 text-white border border-zinc-900">
          <Shield className="w-3 h-3" />
          Admin Diskominfo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
        <Wrench className="w-3 h-3" />
        Teknisi
      </span>
    );
  };

  // Helper untuk render status
  const getStatusBadge = (status) => {
    if (status) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Aktif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Nonaktif
      </span>
    );
  };

  return (
    <div className="space-y-6 relative">
      
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Manajemen Pengguna</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Atur kredensial, peran, dan wilayah tugas bagi Admin Diskominfo serta Teknisi Lapangan.
          </p>
        </div>
        <button 
          onClick={() => setIsRegModalOpen(true)}
          className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Registrasi Pengguna Baru
        </button>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
        
        {/* Filter Role (Apple-style segment control) */}
        <div className="flex bg-zinc-100 p-1 rounded-xl self-stretch md:self-auto">
        {["Semua", "admin", "teknisi"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRoleFilter(role)}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedRoleFilter === role 
                ? "bg-white text-zinc-950 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-950"
            }`}
          >
            {roleLabels[role] || role}
          </button>
        ))}
      </div>

        {/* Input Pencarian */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau email pengguna.." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </div>
      </div>

      {/* LIST USERS TABLE */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">ID USER</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PENGGUNA</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">HAK AKSES / ROLE</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">STATUS AKSES</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-medium text-zinc-400">
                    Tidak ditemukan data pengguna sistem.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onContextMenu={(e) => handleContextMenu(e, user)}
                    className="hover:bg-zinc-50/30 transition-colors group select-none cursor-default"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-mono font-bold text-zinc-500">{user.role === "teknisi" ? "TK-" : user.role === "admin" ? "AD-" : ""}{user.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600 shrink-0 font-bold text-xs uppercase">
                          {user.nama.charAt(0)}
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-bold text-zinc-900 block">{user.nama}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === user.id ? null : user.id);
                          }}
                          className="cursor-pointer p-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-500 hover:text-zinc-950 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-150 rounded-xl shadow-lg py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUser(user);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                              Ubah Akun
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingUser(user);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              Hapus Akses
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONTEXT MENU (KLIK KANAN) */}
      {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white border border-zinc-150 rounded-xl shadow-xl py-1 w-40 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
            Aksi: {contextMenu.user.id}
          </div>
          <button
            onClick={() => {
              setEditingUser(contextMenu.user);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
            Ubah Akun
          </button>
          <button
            onClick={() => {
              setDeletingUser(contextMenu.user);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            Hapus Akses
          </button>
        </div>
      )}

      {/* DIALOG MODAL REGISTRASI USER BARU */}
      <RegisterNewUser isRegModalOpen={isRegModalOpen} setIsRegModalOpen={setIsRegModalOpen} setUsersList={setUsersList} usersList={usersList} />

      {/* DIALOG MODAL EDIT USER */}
      <EditUser editingUser={editingUser} setEditingUser={setEditingUser} setUsersList={setUsersList} usersList={usersList} />

      {/* DIALOG MODAL KONFIRMASI HAPUS */}
      <KonfirmasiDeleteUser deletingUser={deletingUser} setDeletingUser={setDeletingUser} setUsersList={setUsersList} usersList={usersList} />

    </div>
  );
}