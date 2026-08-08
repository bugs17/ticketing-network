"use server";

import { prisma } from "@/lib/db";
import { SignJWT, jwtVerify } from "jose";
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

    // 4. Buat JWT Token (Tetap simpan role di dalam token untuk middleware/session)
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
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    // 6. Kembalikan status success dan nilai role ke frontend
    return { 
      success: true, 
      role: user.role 
      // role: "admin"
    };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }
}



// FUNGSI UNTUK MENGAMBIL USER PROFILE DARI COOKIE JWT
export async function getUserProfile() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // DEBUG 1: Cek apakah cookie terbaca
    if (!token) {
      return null;
    }

    // DEBUG 2: Verifikasi Token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Ambil field sesuai isi payload yang di-set saat loginAction
    return {
      nama: payload.nama || payload.username || "Teknisi Lapangan",
      role: payload.role || "teknisi",
      username: payload.username || "",
      success:true
    };
  } catch (error) {
    // DEBUG 3: Tangkap error jika token kadaluwarsa / secret key mismatch
    return null;
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { error: "Gagal melakukan logout." };
  }
}