"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import KpiCards from "@/components/reports/kpi-cards";
import AnalyticOpdTeraktif from "./analytic-opd-teraktif";
import TicketLogSLA from "./ticket-log-sla-audit";
import { exportReportPdf, exportReportCsv } from "@/app/actions/export-reports";

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);

    try {
      if (format === "pdf") {
        const res = await exportReportPdf();
        if (res.success && res.data) {
          const link = document.createElement("a");
          link.href = res.data;
          link.download = `Laporan_Analitik_SLA_${new Date().toISOString().slice(0, 10)}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert(res.error || "Gagal mengunduh berkas PDF.");
        }
      } else if (format === "csv") {
        const res = await exportReportCsv();
        if (res.success && res.data) {
          const link = document.createElement("a");
          link.href = res.data;
          link.download = `Laporan_Tiket_${new Date().toISOString().slice(0, 10)}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert(res.error || "Gagal mengunduh berkas CSV.");
        }
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Terjadi kesalahan saat memproses ekspor data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Analitik & Laporan
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Pantau performa layanan jaringan, beban kerja teknisi, dan performa SLA secara real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative group">
            <button
              disabled={isExporting}
              className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {isExporting ? "Memproses..." : "Ekspor Data"}
            </button>
            <div className="absolute right-0 mt-1 w-38 bg-white border border-zinc-150 rounded-xl shadow-lg py-1 z-20 hidden group-hover:block hover:block">
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Unduh CSV (.csv)
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Unduh PDF (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <KpiCards />

      {/* ANALYTICS SECTION */}
      <AnalyticOpdTeraktif />

      {/* TICKETS LOG PREVIEW FOR SLA & AUDIT */}
      <TicketLogSLA />
    </div>
  );
}