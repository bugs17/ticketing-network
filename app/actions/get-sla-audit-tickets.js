"use server";

import { prisma } from "@/lib/db";


export async function getSlaAuditTickets() {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Ambil tiket yang dibuat di bulan ini beserta relasi OPD
    const tickets = await prisma.ticket.findMany({
      where: {
        createdAt: {
          gte: firstDayCurrentMonth,
        },
      },
      include: {
        opd: {
          select: {
            nama: true,
            prioritas: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const slaLimitMinutes = 120; // Ambang batas standar SLA: 120 Menit (2 Jam)

    const formattedTickets = tickets.map((ticket) => {
      const priorityRaw = (ticket.opd?.prioritas || "medium").toLowerCase();
      
      let priority = "Sedang";
      let priorityColor = "bg-amber-50 text-amber-600 border-amber-100";

      if (priorityRaw === "high") {
        priority = "Tinggi / Kritis";
        priorityColor = "bg-red-50 text-red-600 border-red-100";
      } else if (priorityRaw === "low") {
        priority = "Rendah";
        priorityColor = "bg-zinc-50 text-zinc-600 border-zinc-200";
      }

      // Hitung durasi pengerjaan / penanganan
      const endTime = ticket.status === "selesai" ? new Date(ticket.updatedAt) : new Date();
      const startTime = new Date(ticket.createdAt);
      const durationMinutes = Math.max(1, Math.floor((endTime - startTime) / (1000 * 60)));

      let durationText = `${durationMinutes} menit`;
      if (durationMinutes >= 60) {
        const hours = Math.floor(durationMinutes / 60);
        const mins = durationMinutes % 60;
        durationText = `${hours}j ${mins}m`;
      }

      const isSlaOk = durationMinutes <= slaLimitMinutes;
      const slaStatus = isSlaOk ? "Terpenuhi (SLA 2j)" : "Terlampaui (SLA 2j)";

      // Format Waktu Indonesia
      const formattedDate = new Date(ticket.createdAt).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      const formattedBeforeTime = new Date(ticket.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      const formattedAfterTime = ticket.status === "selesai" 
        ? new Date(ticket.updatedAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })
        : "-";

      return {
        id: `TK-${ticket.id}`,
        rawId: ticket.id,
        opd: ticket.opd?.nama || "OPD Tidak Teridentifikasi",
        category: ticket.deskripsi_masalah || "Tidak ada rincian kendala.",
        priority,
        priorityColor,
        duration: durationText,
        slaStatus,
        isSlaOk,
        status: ticket.status,
        date: formattedDate,
        totalDuration: `${durationText} ${ticket.status === "selesai" ? "total pengerjaan" : "durasi berjalan"}`,
        images: {
          before: {
            url: ticket.url_foto_before || null,
            notes: ticket.deskripsi_masalah || "Foto diambil saat laporan kendala pertama kali masuk.",
            timestamp: formattedBeforeTime,
          },
          after: {
            url: ticket.url_foto_after || null,
            notes: ticket.status === "selesai" 
              ? "Perbaikan telah selesai dilakukan oleh teknisi di lapangan." 
              : "Pekerjaan belum selesai / belum ada foto eviden penanganan.",
            timestamp: formattedAfterTime,
          },
        },
      };
    });

    return {
      success: true,
      data: formattedTickets,
      error: null,
    };
  } catch (error) {
    console.error("Gagal mengambil log audit SLA:", error);
    return {
      success: false,
      data: [],
      error: "Gagal memuat log audit SLA.",
    };
  }
}