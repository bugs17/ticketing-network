"use client";

import React, { useState, useRef } from "react";
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
  Download
} from "lucide-react";

// Mock Data Awal OPD dengan Token Unik Sistem
const initialOpdList = [
  {
    id: "OPD-001",
    name: "Dinas Kesehatan (Dinkes)",
    head: "Dr. adm. Kesehatan",
    token: "dinkes-noc-token-9281",
    totalTickets: 12,
    location: "Gedung A, Lt. 2"
  },
  {
    id: "OPD-002",
    name: "Diskominfo",
    head: "Bpk. Kepala Kominfo",
    token: "diskominfo-noc-token-1102",
    totalTickets: 8,
    location: "Gedung Utama, Lt. 3"
  },
  {
    id: "OPD-003",
    name: "Bappeda",
    head: "Ibu Kepala Bappeda",
    token: "bappeda-noc-token-4412",
    totalTickets: 5,
    location: "Gedung B, Lt. 1"
  },
  {
    id: "OPD-004",
    name: "Dinas Pendidikan (Disdik)",
    head: "Bpk. Kepala Pendidikan",
    token: "disdik-noc-token-7721",
    totalTickets: 3,
    location: "Gedung C, Lt. 2"
  }
];

export default function OpdPage() {
  const [opdList] = useState(initialOpdList);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState(null);
  
  // State untuk Dialog Cetak
  const [selectedOpd, setSelectedOpd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printAreaRef = useRef(null);

  // Filter pencarian OPD
  const filteredOpd = opdList.filter(opd => 
    opd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opd.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Salin Tautan Cepat
  const handleCopyLink = (token) => {
    const generatedUrl = `https://nettick.gov/report?client=${token}`;
    navigator.clipboard.writeText(generatedUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Trigger Modal Cetak Stiker
  const handleOpenPrintModal = (opd) => {
    setSelectedOpd(opd);
    setIsModalOpen(true);
  };

  // Fungsi Cetak Langsung (Hanya Area Stiker)
  const handlePrint = () => {
    const printContent = printAreaRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Membuka jendela cetak bersih khusus untuk stiker
    const win = window.open("", "_blank", "width=600,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Cetak Stiker QR - ${selectedOpd?.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="flex items-center justify-center min-h-screen bg-white">
          <div class="w-[320px] p-6 border-2 border-dashed border-zinc-300 rounded-2xl text-center bg-white">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Fungsi Mengunduh Seluruh Desain Stiker Menjadi Satu Gambar PNG Utuh
  const handleDownloadQr = () => {
    if (!selectedOpd) return;

    // 1. Buat elemen canvas sementara
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Tentukan resolusi stiker (Rasio 1:1.3 agar tajam saat dicetak/disimpan)
    const width = 400;
    const height = 520;
    canvas.width = width;
    canvas.height = height;

    // 2. Gambar Background Putih & Border Halus
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = "#E4E4E7"; // zinc-200
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 3. Tulis Header: "NOC NETTICK SYSTEM"
    ctx.textAlign = "center";
    ctx.fillStyle = "#A1A1AA"; // zinc-400
    ctx.font = "bold 11px monospace";
    ctx.fillText("NOC NETTICK SYSTEM", width / 2, 45);

    // 4. Tulis Nama OPD (Jika terlalu panjang, kita potong agar pas)
    ctx.fillStyle = "#09090B"; // zinc-950
    ctx.font = "bold 16px sans-serif";
    const displayName = selectedOpd.name.length > 30 
      ? selectedOpd.name.substring(0, 28) + "..." 
      : selectedOpd.name;
    ctx.fillText(displayName, width / 2, 75);

    // Lokasi OPD di bawah Nama
    ctx.fillStyle = "#71717A"; // zinc-500
    ctx.font = "500 12px sans-serif";
    ctx.fillText(selectedOpd.location, width / 2, 95);

    // 5. Muat dan Gambar QR Code di Tengah Canvas
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous"; // Menghindari isu CORS saat menggambar ke canvas
    qrImage.src = getQrUrl(selectedOpd.token);

    qrImage.onload = () => {
      // Posisi gambar QR Code di tengah canvas
      const qrSize = 220;
      const qrX = (width - qrSize) / 2;
      const qrY = 125;

      // Gambar QR Code ke Canvas
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // 6. Tulis Petunjuk: "PINDAI UNTUK LAPOR GANGGUAN"
      ctx.fillStyle = "#71717A"; // zinc-500
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("PINDAI UNTUK LAPOR GANGGUAN", width / 2, 385);

      // 7. Gambar Kotak Badge Token (Background Abu-abu Ringan)
      const badgeText = selectedOpd.token;
      ctx.font = "bold 15px monospace";
      const textWidth = ctx.measureText(badgeText).width;
      
      const badgeWidth = textWidth + 30;
      const badgeHeight = 35;
      const badgeX = (width - badgeWidth) / 2;
      const badgeY = 405;

      ctx.fillStyle = "#F4F4F5"; // zinc-100
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8); // Membuat sudut rounded
      ctx.fill();
      
      ctx.strokeStyle = "#E4E4E7"; // zinc-200
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tulis Teks Token di dalam Badge
      ctx.fillStyle = "#18181B"; // zinc-900
      ctx.textBaseline = "middle";
      ctx.fillText(badgeText, width / 2, badgeY + (badgeHeight / 2));

      // 8. Trigger Unduh Berkas Hasil Gabungan Canvas
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `STIKER-${selectedOpd.token}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    qrImage.onerror = () => {
      alert("Gagal memuat QR Code untuk digabungkan ke stiker.");
    };
  };

  // Endpoint API QR Code (menggunakan API QR Server publik)
  const getQrUrl = (token) => {
    const targetUrl = `https://nettick.gov/report?client=${token}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}&margin=10`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Manajemen OPD</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Daftar unit organisasi daerah terintegrasi stiker QR scan laporan mandiri.
          </p>
        </div>
        <button className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Registrasi OPD Baru
        </button>
      </div>

      {/* 2. ALUR CARA KERJA BANNER */}
      <div className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="space-y-1 max-w-xl z-10">
          <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 text-white">
            <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
            Sistem Pindai QR Pelaporan Mandiri
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Cetak stiker kode QR dari panel di bawah ini, lalu tempelkan di dekat perangkat jaringan/router internal milik OPD. Perwakilan OPD cukup memindai stiker tersebut menggunakan kamera ponsel untuk langsung melaporkan kendala tanpa perlu mengetik nama instansi mereka kembali.
          </p>
        </div>
      </div>

      {/* 3. SEARCH & ACTIONS */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Cari nama instansi dinas, badan, kecamatan, atau ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-150 rounded-xl text-xs focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </div>
      </div>

      {/* 4. LIST OPD CARDS TABLE */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">ID OPD</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NAMA INSTANSI ORGANISASI</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">LOKASI / RUANGAN</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">TOKEN KODE QR</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">TOTAL ADUAN</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">CETAK AKSES STIKER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOpd.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-medium text-zinc-400">
                    Tidak ditemukan data instansi OPD.
                  </td>
                </tr>
              ) : (
                filteredOpd.map((opd) => (
                  <tr key={opd.id} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-mono font-bold text-zinc-500">{opd.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-bold text-zinc-900 block">{opd.name}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">PIC: {opd.head}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-zinc-600">{opd.location}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md font-bold">
                          {opd.token}
                        </span>
                        <button 
                          onClick={() => handleCopyLink(opd.token)}
                          className="p-1 text-zinc-400 hover:text-zinc-950 rounded transition-colors"
                          title="Salin Tautan Pelaporan Smart"
                        >
                          {copiedToken === opd.token ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
                        {opd.totalTickets}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleOpenPrintModal(opd)}
                        className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-950 hover:text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 ml-auto transition-all duration-150 shadow-sm active:scale-95 group-hover:bg-zinc-50 group-hover:hover:bg-zinc-950"
                      >
                        <QrCode className="w-3.5 h-3.5 shrink-0" />
                        <span>Cetak Stiker QR</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DIALOG POPUP PREVIEW & CETAK STIKER (APPLE MINIMALIST MODAL) */}
      {isModalOpen && selectedOpd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-800 tracking-tight">Stiker QR Laporan</span>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-6 flex flex-col items-center justify-center bg-zinc-50/50">
              
              {/* STIKER PREVIEW CONTAINER (Gaya Minimalist Putih Bersih) */}
              <div 
                ref={printAreaRef}
                className="w-full max-w-[280px] bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex flex-col items-center text-center"
              >
                {/* Header Stiker */}
                <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">NOC NETTICK SYSTEM</span>
                <h4 className="text-xs font-extrabold text-zinc-900 mt-1 max-w-[220px] truncate">
                  {selectedOpd.name}
                </h4>
                <p className="text-[9px] text-zinc-400 mt-0.5">{selectedOpd.location}</p>

                {/* QR Code Frame */}
                <div className="my-5 p-2 bg-white border border-zinc-100 rounded-xl shadow-inner flex items-center justify-center">
                  {/* API QR Generator Dinamis */}
                  <img 
                    src={getQrUrl(selectedOpd.token)} 
                    alt="QR Code" 
                    className="w-36 h-36 object-contain"
                  />
                </div>

                {/* Info Barcode / Token di Bawah */}
                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-zinc-400 block uppercase tracking-wider">PINDAI UNTUK LAPOR GANGGUAN</span>
                  <div className="font-mono text-xs font-extrabold text-zinc-800 tracking-wider bg-zinc-50 border border-zinc-150 py-1 px-3 rounded-lg inline-block">
                    {selectedOpd.token}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 text-center mt-4 max-w-[240px]">
                Gunakan printer label thermal untuk hasil stiker tempel terbaik.
              </span>
            </div>

            {/* Modal Footer / Actions */}
            <div className="grid grid-cols-2 gap-2 p-4 border-t border-zinc-100 bg-white">
              <button
                onClick={handleDownloadQr}
                className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh QR
              </button>
              
              <button
                onClick={handlePrint}
                className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-zinc-100"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Stiker
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}