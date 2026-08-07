"use server";

import { prisma } from "@/lib/db";

export const deleteOpd = async (data) => {
    if (!data.id) {
        return {error: "Opd tidak ditemukan!"};
    }

    try {
        await prisma.opd.delete({
            where:{
                id:Number(data.id)
            }
        })
        
        return {success:true};
    } catch (error) {
        return {error:"Terjadi kesalahan server. coba lagi!"}
    }
}