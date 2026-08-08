"use client";

import { getTicketStats } from "@/app/actions/get-ticket-stats-dashboard";
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const StatusGrid = () => {
  const [stats, setStats] = useState({ menunggu: 0, proses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getTicketStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Menunggu Response */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Menunggu Response
          </span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-zinc-950 tracking-tight">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-zinc-300" /> : stats.menunggu}
          </span>
          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
            Butuh Tindakan
          </span>
        </div>
      </div>

      {/* Sedang Ditangani */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Sedang Ditangani
          </span>
          <AlertTriangle className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-zinc-950 tracking-tight">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-zinc-300" /> : stats.proses}
          </span>
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
            Diperbaiki
          </span>
        </div>
      </div>

      {/* Selesai */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Selesai
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-zinc-950 tracking-tight">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-zinc-300" /> : stats.selesai}
          </span>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
            SLA Terpenuhi
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusGrid;