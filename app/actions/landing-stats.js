"use server"

import { prisma } from "@/lib/db"


export async function getLandingStats() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. Hitung Tiket Tuntas Bulan Ini
    const tiketTuntasBulanIni = await prisma.ticket.count({
      where: {
        status: "selesai",
        updatedAt: {
          gte: startOfMonth,
        },
      },
    })

    // 2. Hitung Tiket Diproses (Status: 'proses')
    const tiketDiprosesCount = await prisma.ticket.count({
      where: {
        status: "proses",
      },
    })

    // 3. Hitung Total Teknisi Aktif (Role: 'TEKNISI', isActive: true)
    const totalTeknisiCount = await prisma.user.count({
      where: {
        role: "TEKNISI",
        isActive: true,
      },
    })

    // 4. Hitung Rata-Rata Penanganan (dalam menit) dari Tiket Selesai Bulan Ini
    const tiketSelesaiList = await prisma.ticket.findMany({
      where: {
        status: "selesai",
        updatedAt: {
          gte: startOfMonth,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    })

    let avgMinutes = 0
    if (tiketSelesaiList.length > 0) {
      const totalMinutes = tiketSelesaiList.reduce((acc, ticket) => {
        const diffMs = new Date(ticket.updatedAt) - new Date(ticket.createdAt)
        return acc + Math.max(0, Math.floor(diffMs / (1000 * 60)))
      }, 0)
      avgMinutes = Math.round(totalMinutes / tiketSelesaiList.length)
    }

    // 5. Ambil 2 Log Tiket Terkini
    const recentTickets = await prisma.ticket.findMany({
      take: 2,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        opd: {
          select: {
            nama: true,
          },
        },
      },
    })

    return {
      success: true,
      data: {
        tiketTuntasBulanIni,
        tiketDiprosesCount,
        totalTeknisiCount,
        avgMinutes,
        recentTickets: recentTickets.map((t) => ({
          id: t.id,
          opdNama: t.opd?.nama || "OPD Tidak Terdaftar",
          deskripsi: t.deskripsi_masalah || "Laporan gangguan jaringan",
          status: t.status,
          updatedAt: t.updatedAt,
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching landing stats:", error)
    return {
      success: false,
      data: {
        tiketTuntasBulanIni: 0,
        tiketDiprosesCount: 0,
        totalTeknisiCount: 0,
        avgMinutes: 0,
        recentTickets: [],
      },
    }
  }
}