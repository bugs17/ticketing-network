"use server";

import { prisma } from "@/lib/db";

export const creareNewOpd = async (data) => {
    if (!data.nama || !data.prioritas || !data.token_qr) {
        return {error: "Data required harus lengkap!"}
    }

    try {
        const opdCreated = await prisma.opd.create({
            data:{
                nama:data.nama,
                nama_pic:data.nama_pic,
                kontak_pic:data.kontak_pic,
                token_qr:data.token_qr,
                prioritas:data.prioritas
            }
        })

        return {success: true, data:opdCreated};
        
    } catch (error) {
        if (error.code === "P2002") {
      return { error: "Terjadi masalah pada server. Coba lagi!" };
    }
        return { error: "Terjadi masalah pada server. Coba lagi!" };
    }
}