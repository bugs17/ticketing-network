import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-zinc-50/50 text-zinc-900 selection:bg-[#372aac]/20">
        
        {/* Render Komponen Sidebar Utama */}
        <AppSidebar />

        {/* Area Utama Dashboard Konten */}
        <div className="flex-grow flex flex-col min-w-0 bg-white">
          
          {/* TOP BAR / HEADER DASHBOARD */}
          <header className="h-16 border-b border-zinc-100 px-6 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-4">
              {/* Trigger tombol untuk menyembunyikan/menampilkan sidebar */}
              <SidebarTrigger className="text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 border border-zinc-200 rounded-lg p-1.5" />
              
              <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
              
              {/* Indikator Breadcrumb / Lingkungan Kerja */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">Workspace</span>
                <span className="text-xs text-zinc-300">/</span>
                <span className="text-xs font-bold text-zinc-800">Pusat Kendali Jaringan</span>
              </div>
            </div>

            {/* Sisi Kanan Topbar: Versi Aplikasi */}
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className="border-zinc-200 bg-zinc-50/80 text-zinc-600 text-[10px] font-mono px-2.5 py-0.5 shadow-none rounded-md flex items-center gap-1.5"
              >
                <span className="text-zinc-400 font-normal">v</span>1.0.0
              </Badge>
            </div>
          </header>

          {/* AREA HALAMAN INTERNAL (Dinavigasikan lewat children) */}
          <main 
            className="relative flex-grow overflow-y-auto p-6 md:p-8 bg-zinc-50/50"
            style={{
                backgroundImage: "radial-gradient(#e4e4e7 1px, transparent 1px)", // #e4e4e7 adalah warna zinc-200 super soft
                backgroundSize: "20px 20px" // Jarak kerapatan antar titik (20px)
            }}
            >
            {/* Lapisan gradasi halus dari atas ke bawah agar titik-titik memudar lembut di bagian bawah */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50/20 pointer-events-none" />

            {/* Kontainer konten utama */}
            <div className="relative max-w-7xl mx-auto w-full z-10">
                {children}
            </div>
            </main>

        </div>
      </div>
    </SidebarProvider>
  )
}