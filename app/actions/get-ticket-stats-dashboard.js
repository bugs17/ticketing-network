"use server";

import { prisma } from "@/lib/db";


export async function getTicketStats() {
  try {
    // Menghitung jumlah tiket berdasarkan status menggunakan Prisma aggregate/count
    const [menunggu, proses, selesai] = await Promise.all([
      prisma.ticket.count({
        where: { status: "menunggu" },
      }),
      prisma.ticket.count({
        where: { status: "proses" },
      }),
      prisma.ticket.count({
        where: { status: "selesai" },
      }),
    ]);

    return {
      success: true,
      data: {
        menunggu,
        proses,
        selesai,
      },
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik tiket:", error);
    return {
      success: false,
      data: { menunggu: 0, proses: 0, selesai: 0 },
      error: "Gagal memuat statistik tiket.",
    };
  }
}