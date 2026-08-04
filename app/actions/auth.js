"use server";

import { prisma } from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rahasia-super-aman-diskominfo-123"
);

export async function loginAction({ username, password }) {
  if (!username || !password) {
    return { error: "Username/NIP dan Kata Sandi wajib diisi." };
  }

  try {
    // 1. Cari user di SQLite berdasarkan username
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return { error: "Username atau Kata Sandi salah." };
    }

    // 2. Cek status akun (isActive)
    if (!user.isActive) {
      return { error: "Akun Anda dinonaktifkan. Silakan hubungi Administrator." };
    }

    // 3. Verifikasi Password Plaintext secara langsung
    if (user.password !== password) {
      return { error: "Username atau Kata Sandi salah." };
    }

    // 4. Buat JWT Token (Sertakan id, username, nama, & role ke payload)
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(JWT_SECRET);

    // 5. Simpan Token ke HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }
}