"use server";

import { prisma } from "@/lib/db";

export const createTicketByAdmin = async (data) => {
    if (!data.opdId) {
        return {error:"Parameter ticket tidak lengkap!"};
    }

    try {
        const ticketCreated = await prisma.ticket.create({
            data:{
                opdId:Number(data.opdId),
                deskripsi_masalah:data.deskripsi_masalah
            },
            include:{
                opd:true
            }
        })

        return {success:true, data:ticketCreated};
    } catch (error) {
        return {error:"Terjadi masalah pada server!"}
    }
}