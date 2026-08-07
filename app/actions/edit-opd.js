"use server";

import { prisma } from "@/lib/db";


export const editOpd = async (data) => {
    if (!data.id || !data.nama) {
        return {error: "Data tidak lengkap!"}
    }

    try {
        const dataEdited = await prisma.opd.update({
            where:{
                id:Number(data.id)
            },
            data:{
                nama:data.nama,
                nama_pic:data.nama_pic,
                kontak_pic:data.kontak_pic,
                prioritas:data.prioritas,
                token_qr:data.token_qr,
            },
            include:{
                tickets:true
            }
        })

        return {success: true, data: dataEdited};
    } catch (error) {
        return {error:"Terjadi kesalahan server. coba lagi!"};
    }
}