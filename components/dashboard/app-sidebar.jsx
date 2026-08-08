"use client"

import * as React from "react"
import { 
  TicketCheck, 
  LayoutDashboard, 
  Layers, 
  Users2, 
  LogOut, 
  FileDown,
  Loader2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/app/actions/auth" // Sesuaikan path lokasi logoutAction kamu

const navigationItems = [
  { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Tiket Aduan", icon: TicketCheck, url: "/dashboard/tickets" },
  { title: "Manajemen OPD", icon: Layers, url: "/dashboard/opd" },
  { title: "Manajemen User", icon: Users2, url: "/dashboard/users" },
  { title: "Laporan", icon: FileDown, url: "/dashboard/reports" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const res = await logoutAction()
      
      if (res?.success) {
        // Refresh & redirect ke halaman utama/login
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Gagal logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar className="border-r border-zinc-100 bg-white">
      {/* HEADER SIDEBAR: Informasi Aplikasi */}
      <SidebarHeader className="h-16 border-b border-zinc-100 px-6 py-0 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center shadow-md shadow-zinc-200 shrink-0">
            <TicketCheck className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-bold tracking-tighter block text-sm text-zinc-950 leading-none">
              NetTick Console
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold tracking-wider block mt-1 leading-none">
              INTERNAL NOC
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT SIDEBAR: Menu Navigasi Utama */}
      <SidebarContent className="px-3 py-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
            Navigasi Utama
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full h-auto p-0 rounded-xl transition-all duration-150 ${
                      isActive 
                        ? "bg-zinc-950 text-white hover:bg-zinc-950 hover:text-white shadow-md shadow-zinc-300" 
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                    }`}
                  >
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-3 w-full px-3 py-3.5"
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                      <span className="font-medium text-sm leading-none">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER SIDEBAR: Profil Operator & Keluar */}
      <SidebarFooter className="border-t border-zinc-100 p-4 bg-white space-y-2">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
            OP
          </div>
          <div className="leading-none overflow-hidden">
            <span className="block text-xs font-bold text-zinc-800 truncate">Operator NOC</span>
            <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">DISKOMINFO TIMIKA</span>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              ) : (
                <LogOut className="w-4 h-4 opacity-80" />
              )}
              <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}