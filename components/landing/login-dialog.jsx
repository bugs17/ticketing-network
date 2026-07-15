"use client";

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, User } from "lucide-react"

// Kita gunakan { children } agar tombolnya bisa dikirim dinamis dari luar
const LoginDialog = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <LoginFormModal />
    </Dialog>
  )
}

function LoginFormModal() {
  return (
    <DialogContent className="sm:max-w-md p-[1px] bg-transparent border-none overflow-hidden rounded-3xl shadow-2xl">
      {/* Efek Border Shine */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,#10b981_70%,transparent_100%)] animate-[spin_4s_linear_infinite] opacity-60" />
      
      <div className="relative bg-white p-7 rounded-[23px] w-full z-10 text-left">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> Login Internal DISKOMINFO
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
            Gunakan akun administrator atau teknisi jaringan DISKOMINFO Anda untuk mengelola antrean tiket aduan.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold text-zinc-700">Username / NIP</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input id="username" placeholder="Masukkan username" className="pl-10 pr-4 py-5 border-zinc-200 rounded-lg bg-zinc-50/50 text-sm focus-visible:ring-emerald-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pass" className="text-xs font-semibold text-zinc-700">Kata Sandi</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input id="pass" type="password" placeholder="••••••••" className="pl-10 pr-4 py-5 border-zinc-200 rounded-lg bg-zinc-50/50 text-sm focus-visible:ring-emerald-500" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md mt-2 transition-all active:scale-[0.98]">
            Autentikasi Masuk <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </DialogContent>
  )
}

export default LoginDialog