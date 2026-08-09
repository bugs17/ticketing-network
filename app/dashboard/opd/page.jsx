"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Building2, 
  QrCode, 
  Search, 
  Plus, 
  Printer, 
  Copy, 
  Check,
  Smartphone,
  X,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle
} from "lucide-react";
import ModalAddNewOpd from "@/components/dashboard/modal/register-new-opd";
import { listOpd } from "@/app/actions/get-list-opd";
import PreviewDanPrintQR from "@/components/dashboard/modal/preview-dan-print-qr";
import DeleteOpd from "@/components/dashboard/modal/delete-opd";
import EditOpd from "@/components/dashboard/modal/edit-opd";


export default function OpdPage() {
  const [opdList, setOpdList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState(null);
  
  // State Stiker
  const [selectedOpd, setSelectedOpd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printAreaRef = useRef(null);

  // State Registrasi
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  // State Edit & Hapus
  const [editingOpd, setEditingOpd] = useState(null); 
  const [deletingOpd, setDeletingOpd] = useState(null);

  // State Context Menu (Klik Kanan) & Dropdown Menu
  const [contextMenu, setContextMenu] = useState(null); // { x: 0, y: 0, opd: null }
  const [activeDropdown, setActiveDropdown] = useState(null); // ID OPD yang dropdown-nya sedang terbuka

  // Tutup menu-menu mengambang saat klik di luar area
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu(null);
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const getListOpd = async () => {
      const {data,error, success} = await listOpd()
      if (success) {
        setOpdList(data)
      }
    }
    getListOpd()
  },[])

  const filteredOpd = opdList.filter(opd => 
    opd.nama.toLowerCase().includes(searchQuery.toLowerCase())
    // opd.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (token) => {
    const baseurl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const generatedUrl = `${baseurl}/report?client=${token}`;

    // Gunakan Clipboard API modern jika didukung (HTTPS / Localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedUrl).then(() => {
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
      }).catch((err) => {
        console.error("Gagal menyalin dengan Clipboard API:", err);
        fallbackCopyTextToClipboard(generatedUrl, token);
      });
    } else {
      // Fallback untuk HTTP biasa / browser lama
      fallbackCopyTextToClipboard(generatedUrl, token);
    }
  };

  // Fungsi Cadangan (Fallback) untuk HTTP / Non-Secure Context
  const fallbackCopyTextToClipboard = (text, token) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Pastikan textarea tidak terlihat dan tidak menggeser halaman
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
      } else {
        alert("Gagal menyalin tautan.");
      }
    } catch (err) {
      console.error("Fallback copy error:", err);
      alert("Browser tidak mendukung fitur salin otomatis.");
    }

    document.body.removeChild(textArea);
  };

  const handleOpenPrintModal = (opd) => {
    setSelectedOpd(opd);
    setIsModalOpen(true);
  };



  // Event Handler Klik Kanan Kustom
  const handleContextMenu = (e, opd) => {
    e.preventDefault(); // Mencegah menu bawaan browser muncul
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      opd: opd
    });
    setActiveDropdown(null); // Tutup dropdown jika sedang terbuka
  };


  return (
    <div className="space-y-6 relative">
      
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Manajemen OPD</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Daftar unit organisasi daerah terintegrasi stiker QR scan laporan mandiri.
          </p>
        </div>
        <button 
          onClick={() => setIsRegModalOpen(true)}
          className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Registrasi OPD Baru
        </button>
      </div>

      {/* ALUR CARA KERJA BANNER */}
      <div className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="space-y-1 max-w-xl z-10">
          <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 text-white">
            <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
            Sistem Pindai QR Pelaporan Mandiri
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Klik kanan pada baris tabel untuk memunculkan jalan pintas <strong>Ubah</strong> atau <strong>Hapus</strong> instansi. Anda juga dapat menggunakan menu aksi di ujung kanan baris.
          </p>
        </div>
      </div>

      {/* SEARCH & ACTIONS */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Cari nama instansi dinas, badan, atau kecamatan." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </div>
      </div>

      {/* LIST OPD TABLE */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">ID OPD</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NAMA INSTANSI ORGANISASI</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">TOKEN KODE QR</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">TOTAL ADUAN</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">AKSI / CETAK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOpd.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-medium text-zinc-400">
                    Tidak ditemukan data instansi {searchQuery}.
                  </td>
                </tr>
              ) : (
                filteredOpd.map((opd) => (
                  <tr 
                    key={opd.id} 
                    onContextMenu={(e) => handleContextMenu(e, opd)}
                    className="hover:bg-zinc-50/30 transition-colors group select-none cursor-default"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-mono font-bold text-zinc-500">{"OPD-"}{opd.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-bold text-zinc-900 block">{opd.nama}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">PIC: {opd.nama_pic}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md font-bold">
                          {opd.token_qr}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(opd.token_qr);
                          }}
                          className="p-1 text-zinc-400 hover:text-zinc-950 rounded transition-colors cursor-pointer"
                          title="Salin Tautan Pelaporan Smart"
                        >
                          {copiedToken === opd.token_qr ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
                        {opd.tickets.length}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPrintModal(opd);
                          }}
                          className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-950 hover:text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 shadow-sm active:scale-95"
                        >
                          <QrCode className="w-3.5 h-3.5 shrink-0" />
                          <span>Cetak Stiker</span>
                        </button>

                        {/* Dropdown Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === opd.id ? null : opd.id);
                            }}
                            className="cursor-pointer p-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-500 hover:text-zinc-950 transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown Card */}
                          {activeDropdown === opd.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-zinc-100 rounded-xl shadow-lg py-1 z-20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingOpd(opd);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                                Ubah Data
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingOpd(opd);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-450" />
                                Hapus OPD
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. KUSTOM CONTEXT MENU (KLIK KANAN) */}
      {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white border border-zinc-150 rounded-xl shadow-xl py-1 w-40 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
            Aksi: {contextMenu.opd.id}
          </div>
          <button
            onClick={() => {
              setEditingOpd(contextMenu.opd);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-450" />
            Ubah Data
          </button>
          <button
            onClick={() => {
              setDeletingOpd(contextMenu.opd);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            Hapus OPD
          </button>
        </div>
      )}

      {/* 8. DIALOG MODAL EDIT DATA OPD (APPLE STYLE) */}
      <EditOpd editingOpd={editingOpd} setEditingOpd={setEditingOpd} setOpdList={setOpdList} />

      {/* 9. DIALOG MODAL KONFIRMASI HAPUS */}
      <DeleteOpd deletingOpd={deletingOpd} setDeletingOpd={setDeletingOpd} setOpdList={setOpdList} />

      <PreviewDanPrintQR isModalOpen={isModalOpen} selectedOpd={selectedOpd} setIsModalOpen={setIsModalOpen} />

      {/* Registrasi Modal */}
      <ModalAddNewOpd isRegModalOpen={isRegModalOpen} opdList={opdList} setOpdList={setOpdList} setIsRegModalOpen={setIsRegModalOpen}  />

    </div>
  );
}