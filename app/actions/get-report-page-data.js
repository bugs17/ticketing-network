"use server";

import { prisma } from "@/lib/db";


export async function getReportPageData(clientToken) {
  if (!clientToken) {
    return { success: false, error: "Token client tidak ditemukan." };
  }

  try {
    // 1. Cari OPD berdasarkan token_qr
    const opd = await prisma.opd.findUnique({
      where: {
        token_qr: clientToken,
      },
      select: {
        id: true,
        nama: true,
        token_qr: true,
        nama_pic: true,
        kontak_pic: true,
        prioritas: true,
      },
    });

    if (!opd) {
      return { success: false, error: "OPD tidak ditemukan atau token tidak valid." };
    }

    // 2. Ambil seluruh tiket milik OPD ini
    const tickets = await prisma.ticket.findMany({
      where: {
        opdId: opd.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Cek tiket aktif ("menunggu" / "proses")
    const hasActiveTicket = tickets.some(
      (t) => t.status === "menunggu" || t.status === "proses"
    );

    return {
      success: true,
      opd,
      tickets,
      hasActiveTicket,
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    return { success: false, error: "Gagal mengambil data dari database." };
  }
}

export async function createTicketReport({ opdId, issueDescription }) {
  try {
    const activeTicket = await prisma.ticket.findFirst({
      where: {
        opdId,
        status: { in: ["menunggu", "proses"] },
      },
    });

    if (activeTicket) {
      return { success: false, error: "Masih terdapat laporan aktif yang sedang ditangani." };
    }

    const newTicket = await prisma.ticket.create({
      data: {
        opdId,
        deskripsi_masalah: issueDescription,
        status: "menunggu",
      },
    });

    return {
      success: true,
      ticketId: `TCK-${newTicket.id}`,
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Gagal mengirimkan laporan." };
  }
}