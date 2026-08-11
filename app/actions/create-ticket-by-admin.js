"use server";

import { prisma } from "@/lib/db";

export const createTicketByAdmin = async (data) => {
    if (!data.opdId || !data.nama_pelapor || !data.kontak_pelapor) {
        return { success: false, error: "Parameter tiket tidak lengkap!" };
    }

    try {
        const ticketCreated = await prisma.ticket.create({
            data: {
                opdId: Number(data.opdId),
                nama_pelapor: data.nama_pelapor,
                kontak_pelapor: data.kontak_pelapor,
                deskripsi_masalah: data.deskripsi_masalah || null,
            },
            include: {
                opd: true,
            },
        });

        return { success: true, data: ticketCreated };
    } catch (error) {
        return { success: false, error: "Terjadi masalah pada server!" };
    }
};