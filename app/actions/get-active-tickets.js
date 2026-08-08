"use server";

import { prisma } from "@/lib/db";


export async function getActiveTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        status: {
          in: ["menunggu", "proses"],
        },
      },
      include: {
        opd: {
          select: {
            nama: true,
            nama_pic: true,
            kontak_pic: true,
            prioritas: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: tickets,
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil tiket aktif:", error);
    return {
      success: false,
      data: [],
      error: "Gagal memuat daftar tiket aktif.",
    };
  }
}