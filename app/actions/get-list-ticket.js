"use server";

import { prisma } from "@/lib/db";


export const listTicket = async () => {
    try {
        const data = await prisma.ticket.findMany({
            include:{
                opd:true
            }
        });

        return {success: true, data:data};
    } catch (error) {
        return {error:"Terjadi masalah server!"};
    }
}