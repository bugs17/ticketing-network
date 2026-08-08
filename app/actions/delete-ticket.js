"use server";

import { prisma } from "@/lib/db";


export const deleteTicket = async (ticketId) => {
    if (!ticketId) {
        return {error:"Paramater tidak lengkap!"}
    }

    try {
        await prisma.ticket.delete({
            where:{
                id:Number(ticketId)
            }
        })
        return {success:true};
    } catch (error) {
        return {error:"Terjadi masalah pada server!"}
    }
}