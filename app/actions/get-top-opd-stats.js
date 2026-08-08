"use server";

import { prisma } from "@/lib/db";


export async function getTopOpdStats() {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // 1. Agregasi jumlah tiket berdasarkan OPD (Top 5)
    const topOpdGroups = await prisma.ticket.groupBy({
      by: ["opdId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    if (topOpdGroups.length === 0) {
      return {
        success: true,
        data: [],
        error: null,
      };
    }

    const maxCount = topOpdGroups[0]._count.id;
    const opdIds = topOpdGroups.map((g) => g.opdId).filter(Boolean);

    // 2. Ambil data profil OPD
    const opdProfiles = await prisma.opd.findMany({
      where: {
        id: { in: opdIds },
      },
      select: {
        id: true,
        nama: true,
      },
    });

    const opdMap = new Map(opdProfiles.map((o) => [o.id, o.nama]));

    // 3. Hitung tren (Bulan Ini vs Bulan Lalu) untuk 5 OPD teratas
    const [currentMonthCounts, lastMonthCounts] = await Promise.all([
      prisma.ticket.groupBy({
        by: ["opdId"],
        where: {
          opdId: { in: opdIds },
          createdAt: { gte: firstDayCurrentMonth },
        },
        _count: { id: true },
      }),
      prisma.ticket.groupBy({
        by: ["opdId"],
        where: {
          opdId: { in: opdIds },
          createdAt: {
            gte: firstDayLastMonth,
            lte: lastDayLastMonth,
          },
        },
        _count: { id: true },
      }),
    ]);

    const currentMap = new Map(currentMonthCounts.map((c) => [c.opdId, c._count.id]));
    const lastMap = new Map(lastMonthCounts.map((l) => [l.opdId, l._count.id]));

    // 4. Susun payload data UI
    const result = topOpdGroups.map((group, index) => {
      const count = group._count.id;
      const opdName = opdMap.get(group.opdId) || "OPD Tidak Teridentifikasi";
      const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

      const currentCount = currentMap.get(group.opdId) || 0;
      const lastCount = lastMap.get(group.opdId) || 0;

      let trend = "stabil";
      if (currentCount > lastCount) trend = "naik";
      else if (currentCount < lastCount) trend = "turun";

      return {
        rank: index + 1,
        name: opdName,
        count,
        percentage,
        trend,
      };
    });

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik OPD teraktif:", error);
    return {
      success: false,
      data: [],
      error: "Gagal memuat data statistik OPD.",
    };
  }
}