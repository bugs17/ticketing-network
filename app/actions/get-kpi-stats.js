"use server";

import { prisma } from "@/lib/db";


export async function getKpiStats() {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // 1. Hitung Total Tiket Masuk (Keseluruhan, Bulan Ini, dan Bulan Lalu)
    const [totalTickets, ticketsCurrentMonth, ticketsLastMonth] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({
        where: { createdAt: { gte: firstDayCurrentMonth } },
      }),
      prisma.ticket.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
            lte: lastDayLastMonth,
          },
        },
      }),
    ]);

    // Kalkulasi % perubahan dibanding bulan lalu
    let monthlyChangeText = "Belum ada data pembanding";
    if (ticketsLastMonth > 0) {
      const diff = ticketsCurrentMonth - ticketsLastMonth;
      const pct = Math.round((diff / ticketsLastMonth) * 100);
      monthlyChangeText = `${pct >= 0 ? "+" : ""}${pct}% dari bulan lalu`;
    } else if (ticketsCurrentMonth > 0) {
      monthlyChangeText = `+100% dari bulan lalu`;
    }

    // 2. Ambil semua tiket yang berstatus 'selesai'
    const completedTickets = await prisma.ticket.findMany({
      where: { status: "selesai" },
      select: { createdAt: true, updatedAt: true },
    });

    let totalDurationMinutes = 0;
    let SLAOnTimeCount = 0;
    const slaLimitMinutes = 120; // Batas SLA: 2 Jam (120 Menit)

    completedTickets.forEach((t) => {
      const durationMin = Math.max(
        1,
        Math.floor((new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60))
      );
      totalDurationMinutes += durationMin;

      if (durationMin <= slaLimitMinutes) {
        SLAOnTimeCount++;
      }
    });

    const totalCompleted = completedTickets.length;

    // Perkondisian agar tidak terjadi pembagian dengan 0 saat belum ada tiket selesai
    const onTimeRate =
      totalCompleted > 0
        ? `${((SLAOnTimeCount / totalCompleted) * 100).toFixed(1)}%`
        : "0%";

    const onTimeSubtext =
      totalCompleted > 0
        ? `Dari ${totalCompleted} tiket selesai`
        : "Belum ada tiket selesai";

    const avgDuration =
      totalCompleted > 0 ? Math.round(totalDurationMinutes / totalCompleted) : 0;

    const avgDurationText =
      totalCompleted === 0
        ? "-"
        : avgDuration >= 60
        ? `${Math.floor(avgDuration / 60)}j ${avgDuration % 60}m`
        : `${avgDuration} mnt`;

    // 3. Hitung Tiket yang melampaui SLA (Aktif > 2 jam ATAU Selesai > 2 jam)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const breachedActiveCount = await prisma.ticket.count({
      where: {
        status: { in: ["menunggu", "proses"] },
        createdAt: { lt: twoHoursAgo },
      },
    });

    const breachedCompletedCount = completedTickets.filter(
      (t) => (new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60) > slaLimitMinutes
    ).length;

    const totalSlaBreached = breachedActiveCount + breachedCompletedCount;

    return {
      success: true,
      data: {
        totalTickets: totalTickets.toString(),
        totalChange: monthlyChangeText,
        onTimeRate,
        onTimeSubtext,
        avgDuration: avgDurationText,
        slaBreached: `${totalSlaBreached} tiket`,
      },
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik KPI:", error);
    return {
      success: false,
      data: null,
      error: "Gagal memuat statistik KPI.",
    };
  }
}