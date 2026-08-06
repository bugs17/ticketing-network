"use server";

import { prisma } from "@/lib/db";


export const deleteUser = async (data) => {
    if (!data.id) {
        return {error:"User yang ingin dihapus tidak ditemukan!"}
    }

    try {
        await prisma.user.delete({
            where:{
                id:Number(data.id)
            }
        })

        return {success:true};
    } catch (error) {
        return {error: "Terjadi kesalahan server. coba lagi!"}
    }
}