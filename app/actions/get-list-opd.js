"use server";

import { prisma } from "@/lib/db";

export const listOpd = async () => {
    try {
        const listOpd = await prisma.opd.findMany({
            include:{
                tickets:true
            }
        })
        return {success:true, data: listOpd}
    } catch (error) {
        return {error:"Terjadi kesalahan pada server. coba lagi!"}
    }
}