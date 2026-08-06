"use server";

import { prisma } from "@/lib/db";


export const editUser = async (data) => {

    try {
        const editedUSer = await prisma.user.update({
            where:{
                id:Number(data.id)
            },
            data:{
                nama:data.nama,
                email:data.email,
                username:data.username,
                password:data.password,
                role:data.role,
                isActive:data.isActive
            }
        })

        return {success:true, data: editedUSer}
    } catch (error) {
        if (error.code === "P2002") {
            return { error: "Email atau Username sudah terdaftar!" };
        }
            return { error: "Terjadi masalah pada server. Coba lagi!" };
    }
}