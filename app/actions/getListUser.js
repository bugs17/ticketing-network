"use server";

import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";


const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "rahasia-super-aman-diskominfo-123" 
);


// fungsi untuk extract userID dari AuthToken
const getUserIDFromAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if(!token) {
        return { error: "Sesi tidak valid." };
    }
    
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.userId; // Mengambil userId dari payload JWT
    } catch (error) {
        return { error: "Sesi tidak valid." };
    }
}


// fungsi untuk get All user exept userId from function above
export const getListUser = async () => {
    const currentUserId = await getUserIDFromAuthToken();

    try {
        const users = await prisma.user.findMany({
            where:{
                id:{
                    not:Number(currentUserId)
                }
            }
        })

        return {success:true, data:users};
    } catch (error) {
        return {error: "Gagal mengambil data user."}
    }
}