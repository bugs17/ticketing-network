"use client";

import { getKpiStats } from "@/app/actions/get-kpi-stats";
import { AlertTriangle, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const KpiCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpi = async () => {
      setLoading(true);
      const res = await getKpiStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    };

    fetchKpi();
  }, []);

  const summaryStats = [
    {
      label: "Total Tiket Masuk",
      value: stats?.totalTickets ?? "0",
      change: stats?.totalChange ?? "-",
      icon: FileText,
    },
    {
      label: "Selesai Tepat Waktu",
      value: stats?.onTimeRate ?? "0%",
      change: stats?.onTimeSubtext ?? "Target minimal: 90%",
      icon: CheckCircle2,
    },
    {
      label: "Rata-rata Durasi Resolusi",
      value: stats?.avgDuration ?? "-",
      change: "Berdasarkan tiket selesai",
      icon: Clock,
    },
    {
      label: "SLA Terlampaui",
      value: stats?.slaBreached ?? "0 tiket",
      change: "Batas SLA: 2 Jam",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              {loading ? (
                <div className="py-1 flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                </div>
              ) : (
                <span className="text-2xl font-bold tracking-tight text-zinc-950">
                  {stat.value}
                </span>
              )}
              <span className="text-[10px] text-zinc-500 block font-medium">
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;