"use client";

import { getTopOpdStats } from "@/app/actions/get-top-opd-stats";
import { Building, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const AnalyticOpdTeraktif = () => {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getTopOpdStats();
      if (res.success && res.data) {
        setOpdList(res.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-950">
            OPD Teraktif (Laporan Kendala)
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Daftar instansi dengan frekuensi penanganan gangguan tertinggi.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
          <Building className="w-3 h-3" />
          OPD Level
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Memuat statistik OPD...</span>
          </div>
        ) : opdList.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200 p-4">
            Belum ada data laporan dari OPD.
          </div>
        ) : (
          opdList.map((opd) => (
            <div key={opd.rank} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-400">
                    #{opd.rank}
                  </span>
                  <span className="font-bold text-zinc-800 truncate max-w-[180px] sm:max-w-xs">
                    {opd.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-zinc-900">
                    {opd.count} Tiket
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      opd.trend === "naik"
                        ? "bg-red-50 text-red-600"
                        : opd.trend === "turun"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    {opd.trend === "naik"
                      ? "↑ Naik"
                      : opd.trend === "turun"
                      ? "↓ Turun"
                      : "• Stabil"}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                  style={{ width: `${opd.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnalyticOpdTeraktif;