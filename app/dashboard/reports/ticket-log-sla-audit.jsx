"use client";

import { getSlaAuditTickets } from "@/app/actions/get-sla-audit-tickets";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageOff,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

const TicketLogSLA = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketForAudit, setSelectedTicketForAudit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      const res = await getSlaAuditTickets();
      if (res.success && res.data) {
        setTickets(res.data);
      }
      setLoading(false);
    };

    fetchAuditLogs();
  }, []);

  // Menutup Drawer saat menekan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedTicketForAudit(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Kalkulasi Pagination
  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fungsi Ekspor Bukti Fisik Tiket ke PDF via Clean Print Frame
  const handleExportSinglePDF = (ticket) => {
    if (!ticket) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      alert("Gagal membuka jendela cetak. Pastikan pop-up blocker diizinkan.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Berita Acara & Audit SLA - ${ticket.id}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #09090b;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #09090b;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title { font-size: 16pt; font-weight: bold; margin: 0; text-transform: uppercase; }
          .subtitle { font-size: 9pt; color: #71717a; margin-top: 4px; }
          .badge-id {
            background-color: #f4f4f5;
            border: 1px solid #e4e4e7;
            padding: 4px 8px;
            font-family: monospace;
            font-size: 10pt;
            font-weight: bold;
            border-radius: 4px;
          }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
          .card { background-color: #fafafa; border: 1px solid #e4e4e7; padding: 10px 14px; border-radius: 6px; }
          .label { font-size: 8pt; font-weight: bold; color: #71717a; text-transform: uppercase; margin-bottom: 2px; }
          .val { font-size: 10pt; font-weight: 600; color: #09090b; }
          .val-ok { color: #059669; }
          .val-fail { color: #dc2626; }
          .section-title {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            border-left: 3px solid #09090b;
            padding-left: 8px;
          }
          .photo-box {
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 16px;
          }
          .photo-header {
            background-color: #f4f4f5;
            padding: 6px 12px;
            font-size: 9pt;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e4e4e7;
          }
          .photo-img { width: 100%; max-height: 240px; object-fit: cover; display: block; background-color: #f4f4f5; }
          .photo-no-img {
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a1a1aa;
            font-size: 9pt;
            background-color: #fafafa;
          }
          .photo-notes { padding: 8px 12px; font-size: 9pt; color: #3f3f46; background-color: #fff; }
          .footer-sign {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            text-align: center;
            page-break-inside: avoid;
          }
          .sign-box { height: 70px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Berita Acara Audit SLA</h1>
            <div class="subtitle">Dokumen Verifikasi Kelayakan Bukti Fisik & Waktu Tanggap (Audit)</div>
          </div>
          <div class="badge-id">TIKET: ${ticket.id}</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">Instansi Pelapor (OPD)</div>
            <div class="val">${ticket.opd}</div>
          </div>
          <div class="card">
            <div class="label">Tanggal Laporan</div>
            <div class="val">${ticket.date}</div>
          </div>
          <div class="card">
            <div class="label">Status Kelayakan SLA</div>
            <div class="val ${ticket.isSlaOk ? "val-ok" : "val-fail"}">
              ${ticket.slaStatus} (${ticket.duration})
            </div>
          </div>
          <div class="card">
            <div class="label">Tingkat Prioritas</div>
            <div class="val">${ticket.priority}</div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 20px;">
          <div class="label">Deskripsi Kendala</div>
          <div class="val" style="font-weight: normal;">${ticket.category}</div>
        </div>

        <div class="section-title">Dokumentasi Fisik Pekerjaan</div>

        <!-- BEFORE -->
        <div class="photo-box">
          <div class="photo-header">
            <span>SEBELUM PERBAIKAN (BEFORE)</span>
            <span>${ticket.images?.before?.timestamp || "-"}</span>
          </div>
          ${
            ticket.images?.before?.url
              ? `<img class="photo-img" src="${ticket.images.before.url}" alt="Foto Before" />`
              : `<div class="photo-no-img">Foto Sebelum (Before) tidak dilampirkan</div>`
          }
          <div class="photo-notes">Catatan: ${ticket.images?.before?.notes || "-"}</div>
        </div>

        <!-- AFTER -->
        <div class="photo-box">
          <div class="photo-header">
            <span>SETELAH PERBAIKAN (AFTER)</span>
            <span>${ticket.images?.after?.timestamp || "-"}</span>
          </div>
          ${
            ticket.images?.after?.url
              ? `<img class="photo-img" src="${ticket.images.after.url}" alt="Foto After" />`
              : `<div class="photo-no-img">Foto Setelah (After) tidak dilampirkan</div>`
          }
          <div class="photo-notes">Catatan: ${ticket.images?.after?.notes || "-"}</div>
        </div>

        <!-- SIGNATURE AREA -->
        <div class="footer-sign">
          <div>
            <div style="font-size: 9pt; color: #71717a;">Teknisi Penanggung Jawab</div>
            <div class="sign-box"></div>
            <div style="font-weight: bold; font-size: 10pt;">( .................................... )</div>
          </div>
          <div>
            <div style="font-size: 9pt; color: #71717a;">Tim Audit / Verifikasi</div>
            <div class="sign-box"></div>
            <div style="font-weight: bold; font-size: 10pt;">( .................................... )</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      {/* TICKETS LOG PREVIEW FOR SLA & AUDIT */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-950">
            Kelayakan Dokumen Bukti & SLA (Bulan Ini)
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Klik pada baris tiket untuk membuka Drawer Bukti Foto *Before / After* untuk audit.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex items-center justify-center text-zinc-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-medium">Memuat data audit SLA...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200 p-4">
              Belum ada data tiket bulan ini.
            </div>
          ) : (
            <>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
                    <th className="p-3 font-mono">ID TIKET</th>
                    <th className="p-3">Instansi Pelapor</th>
                    <th className="p-3">Kategori Masalah</th>
                    <th className="p-3">Prioritas</th>
                    <th className="p-3">Respons SLA</th>
                    <th className="p-3 text-right">Aksi Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {currentTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicketForAudit(ticket)}
                      className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-zinc-500 group-hover:text-zinc-900">
                          {ticket.id}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-zinc-800">{ticket.opd}</td>
                      <td className="p-3 text-zinc-500 max-w-xs truncate">
                        {ticket.category}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${ticket.priorityColor}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-500 font-mono">
                        {ticket.duration}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <span className="cursor-pointer text-[11px] font-bold text-zinc-500 group-hover:text-zinc-950 group-hover:underline inline-flex items-center gap-1 transition-all">
                          Periksa Bukti Foto
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION CONTROL */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <div>
                  Menampilkan{" "}
                  <span className="font-bold text-zinc-800">{startIndex + 1}</span> -{" "}
                  <span className="font-bold text-zinc-800">
                    {Math.min(startIndex + ITEMS_PER_PAGE, tickets.length)}
                  </span>{" "}
                  dari <span className="font-bold text-zinc-800">{tickets.length}</span> tiket
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${
                          currentPage === page
                            ? "bg-zinc-950 text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Halaman Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* BACKDROP & SLIDE-OVER DRAWER (BUKTI AUDIT FISIK) */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
          selectedTicketForAudit
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={() => setSelectedTicketForAudit(null)}
          className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${
            selectedTicketForAudit ? "opacity-30 backdrop-blur-sm" : "opacity-0"
          }`}
        />

        {/* Drawer Container */}
        <div className="absolute inset-y-0 right-0 max-w-xl w-full flex pl-10">
          <div
            className={`w-full bg-white shadow-2xl border-l border-zinc-100 flex flex-col justify-between transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
              selectedTicketForAudit ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedTicketForAudit && (
              <>
                {/* DRAWER HEADER */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-zinc-100 text-zinc-800 rounded-md">
                        {selectedTicketForAudit.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Audit-Ready
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 leading-tight">
                      {selectedTicketForAudit.opd}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForAudit(null)}
                    className="cursor-pointer p-1.5 text-zinc-400 hover:text-zinc-950 rounded-xl hover:bg-zinc-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* DRAWER BODY (Scrollable content) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* METADATA TEKNISI & PEKERJAAN */}
                  <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-150/70 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Status SLA
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          selectedTicketForAudit.isSlaOk
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedTicketForAudit.slaStatus}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Waktu Laporan
                      </span>
                      <span className="font-bold text-zinc-800 text-[11px]">
                        {selectedTicketForAudit.date}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-zinc-200/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Deskripsi Kendala
                      </span>
                      <span className="font-medium text-zinc-700 leading-relaxed">
                        {selectedTicketForAudit.category}
                      </span>
                    </div>
                  </div>

                  {/* FOTO BEFORE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Sebelum Perbaikan (Before)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {selectedTicketForAudit.images?.before?.timestamp}
                      </span>
                    </div>

                    {selectedTicketForAudit.images?.before?.url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                        <img
                          src={selectedTicketForAudit.images.before.url}
                          alt="Kondisi Sebelum"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
                        <ImageOff className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-[11px] font-medium">
                          Foto Sebelum (Before) belum diunggah
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images?.before?.notes}
                    </p>
                  </div>

                  {/* FOTO AFTER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        Setelah Perbaikan (After)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {selectedTicketForAudit.images?.after?.timestamp}
                      </span>
                    </div>

                    {selectedTicketForAudit.images?.after?.url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                        <img
                          src={selectedTicketForAudit.images.after.url}
                          alt="Kondisi Setelah"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
                        <ImageOff className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-[11px] font-medium">
                          Foto Setelah (After) belum diunggah
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      {selectedTicketForAudit.images?.after?.notes}
                    </p>
                  </div>
                </div>

                {/* DRAWER FOOTER (ACTIONS) */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForAudit(null)}
                    className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-3 px-4 rounded-xl transition-all text-center"
                  >
                    Tutup Panel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportSinglePDF(selectedTicketForAudit)}
                    className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor Bukti Fisik
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketLogSLA;