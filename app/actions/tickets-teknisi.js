"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetch semua tiket dari database Prisma
 */
export async function getTicketsData() {
  try {
    // 1. TUGAS LAPANGAN: Ambil SEMUA tiket yang belum selesai (tanpa batasan waktu)
    const activeTickets = await prisma.ticket.findMany({
      where: {
        status: { in: ["menunggu", "proses"] }
      },
      include: {
        opd: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Hitung batas waktu 2 hari yang lalu dari sekarang
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // 2. SELESAI BERES: Hanya ambil tiket selesai dalam 2 HARI TERAKHIR
    const historyTickets = await prisma.ticket.findMany({
      where: {
        status: "selesai",
        updatedAt: {
          gte: twoDaysAgo // Lebih besar atau sama dengan 2 hari lalu
        }
      },
      include: {
        opd: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return { activeTickets, historyTickets };
  } catch (error) {
    console.error("Gagal mengambil data tiket:", error);
    return { activeTickets: [], historyTickets: [] };
  }
}

/**
 * Mengubah status tiket menjadi 'proses' saat teknisi menekan tombol "Mulai Kerjakan"
 */
export async function setTicketToProgress(ticketId) {
  try {
    await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: { status: "proses" }
    });
    revalidatePath("/dashboard-teknisi");
    return { success: true };
  } catch (error) {
    console.error("Gagal merubah status tiket:", error);
    throw new Error("Gagal memulai pekerjaan.");
  }
}

/**
 * Menyimpan progres sementara / terkendala
 */
export async function savePartialProgress({ ticketId, realIssue, beforeImage }) {
  try {
    await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: {
        status: "proses",
        deskripsi_masalah: realIssue,
        ...(beforeImage && { url_foto_before: beforeImage })
      }
    });
    revalidatePath("/dashboard-teknisi");
    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan progres:", error);
    throw new Error("Gagal menyimpan progres terkendala.");
  }
}

/**
 * Menutup tiket dan menandai 'selesai'
 */
export async function finishAndCloseTicket({ ticketId, realIssue, beforeImage, afterImage }) {
  try {
    await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: {
        status: "selesai",
        deskripsi_masalah: realIssue,
        url_foto_before: beforeImage,
        url_foto_after: afterImage
      }
    });
    revalidatePath("/dashboard-teknisi");
    return { success: true };
  } catch (error) {
    console.error("Gagal menyelesaikan tiket:", error);
    throw new Error("Gagal menutup tiket.");
  }
}