"use client";

import { getTopOpdReports } from "@/app/actions/get-top-opd";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const TopOpdCard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopOpd = async () => {
      setLoading(true);
      const res = await getTopOpdReports(4);
      if (res.success && res.data) {
        setReports(res.data);
      }
      setLoading(false);
    };

    fetchTopOpd();
  }, []);

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-950">Laporan Terbanyak per OPD</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Daftar unit kerja dengan frekuensi aduan tertinggi.</p>
        </div>

        {/* State Loading & List OPD */}
        {loading ? (
          <div className="py-12 flex items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Memuat data OPD...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">Belum ada data laporan.</div>
        ) : (
          <div className="space-y-4 pt-2">
            {reports.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 truncate max-w-[200px]" title={item.nama}>
                    {item.nama}
                  </span>
                  <span className="font-mono font-bold text-zinc-900 shrink-0">
                    {item.count} Laporan
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Tambahan */}
      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 border-t border-zinc-50 pt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Data diperbarui secara realtime berdasarkan total database internal.
      </div>
    </div>
  );
};

export default TopOpdCard;