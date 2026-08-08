"use server";

import { prisma } from "@/lib/db";


export async function getTopOpdReports(limit = 4) {
  try {
    // 1. Agregasi hitung total tiket per opdId
    const ticketGroup = await prisma.ticket.groupBy({
      by: ["opdId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    if (ticketGroup.length === 0) {
      return { success: true, data: [] };
    }

    // 2. Ambil detail nama OPD untuk ID yang didapat dari agregasi
    const opdIds = ticketGroup.map((item) => item.opdId);
    const opds = await prisma.opd.findMany({
      where: {
        id: { in: opdIds },
      },
      select: {
        id: true,
        nama: true,
      },
    });

    const opdMap = new Map(opds.map((o) => [o.id, o.nama]));

    // 3. Cari jumlah terbanyak sebagai acuan 100% progress bar
    const maxCount = ticketGroup[0]?._count.id || 1;

    // 4. Format data akhir
    const formattedData = ticketGroup.map((item) => {
      const count = item._count.id;
      const percentage = Math.round((count / maxCount) * 100);

      return {
        id: item.opdId,
        nama: opdMap.get(item.opdId) || "OPD Tidak Ditemukan",
        count,
        percentage,
      };
    });

    return {
      success: true,
      data: formattedData,
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil data top OPD:", error);
    return {
      success: false,
      data: [],
      error: "Gagal memuat data laporan OPD.",
    };
  }
}