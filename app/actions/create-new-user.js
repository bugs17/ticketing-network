"use server";

import { prisma } from "@/lib/db";

export const createNewUser = async (data) => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
      },
    });

    return { success: true, data: createdUser };
  } catch (error) {
    if (error.code === "P2002") {
      return { error: "Email atau Username sudah terdaftar!" };
    }
    return { error: "Terjadi masalah pada server. Coba lagi!" };
  }
};