"use server";

import { prisma } from "@/lib/db";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs/promises";
import path from "path";

// Helper untuk mengubah URL Foto (atau Local Path) ke Base64 agar dapat dibaca jsPDF
async function fetchImageAsBase64(urlOrPath) {
  if (!urlOrPath) return null;
  try {
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const response = await fetch(urlOrPath);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get("content-type") || "image/jpeg";
      return `data:${contentType};base64,${buffer.toString("base64")}`;
    } else {
      // Jika tersimpan secara lokal di folder public
      const cleanPath = urlOrPath.startsWith("/") ? urlOrPath.slice(1) : urlOrPath;
      const localPath = path.join(process.cwd(), "public", cleanPath);
      const buffer = await fs.readFile(localPath);
      const ext = path.extname(localPath).toLowerCase();
      const format = ext === ".png" ? "image/png" : "image/jpeg";
      return `data:${format};base64,${buffer.toString("base64")}`;
    }
  } catch (err) {
    console.warn("Gagal memuat gambar eviden:", urlOrPath, err.message);
    return null;
  }
}

export async function exportReportPdf() {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Fetch Data dari Database
    const [tickets, totalTickets, completedTicketsCount] = await Promise.all([
      prisma.ticket.findMany({
        where: { createdAt: { gte: firstDayCurrentMonth } },
        include: { opd: { select: { nama: true, prioritas: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "selesai" } }),
    ]);

    // 2. Baca Logo Kop Surat
    let komdigiBase64 = null;
    let mimikaBase64 = null;

    try {
      const komdigiBuffer = await fs.readFile(
        path.join(process.cwd(), "public", "logo_komdigi.png")
      );
      komdigiBase64 = `data:image/png;base64,${komdigiBuffer.toString("base64")}`;
    } catch (e) {}

    try {
      const mimikaBuffer = await fs.readFile(
        path.join(process.cwd(), "public", "logo_mimika.jpg")
      );
      mimikaBase64 = `data:image/jpeg;base64,${mimikaBuffer.toString("base64")}`;
    } catch (e) {}

    // 3. Inisialisasi Dokumen PDF (A4)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    // --- HELPER FUNCTION: DRAW KOP SURAT ---
    const drawKopSurat = () => {
      if (komdigiBase64) doc.addImage(komdigiBase64, "PNG", 15, 12, 18, 18);
      if (mimikaBase64) doc.addImage(mimikaBase64, "JPEG", pageWidth - 33, 12, 18, 18);

      doc.setTextColor(24, 24, 27);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PEMERINTAH KABUPATEN MIMIKA", centerX, 16, { align: "center" });

      doc.setFontSize(13);
      doc.text("DINAS KOMUNIKASI DAN INFORMATIKA", centerX, 22, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "Jl. Cendrawasih SP3, Kuala Kencana, Pusat Pemerintah Kabupaten Mimika, Timika - Papua Tengah",
        centerX,
        27,
        { align: "center" }
      );
      doc.text(
        "Website: https://diskominfo.mimikakab.go.id | Email: helpdesk-jaringan@mimikakab.go.id",
        centerX,
        31,
        { align: "center" }
      );

      doc.setDrawColor(24, 24, 27);
      doc.setLineWidth(0.8);
      doc.line(15, 36, pageWidth - 15, 36);
      doc.setLineWidth(0.2);
      doc.line(15, 37.2, pageWidth - 15, 37.2);
    };

    // Render Kop Surat Halaman Pertama
    drawKopSurat();

    // ----------------------------------------------------
    // JUDUL DOKUMEN & PERIODE
    // ----------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("LAPORAN ANALITIK KINERJA LAYANAN JARINGAN & SLA", centerX, 45, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Periode Data: ${now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })} | Dicetak Pada: ${now.toLocaleString("id-ID")}`,
      centerX,
      50,
      { align: "center" }
    );

    // ----------------------------------------------------
    // RINGKASAN EXECUTION / KPI METRICS
    // ----------------------------------------------------
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 55, pageWidth - 30, 20, 2, 2, "FD");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("RINGKASAN METRIK PERFORMA:", 19, 61);

    doc.setFont("helvetica", "normal");
    doc.text(`• Total Tiket: ${totalTickets}`, 19, 67);
    doc.text(`• Tiket Selesai: ${completedTicketsCount}`, 75, 67);
    doc.text(`• Target SLA: 120 Menit (2 Jam)`, 135, 67);

    // ----------------------------------------------------
    // TABEL REKAPITULASI LOG AUDIT TIKET
    // ----------------------------------------------------
    const tableData = tickets.map((t) => {
      const startTime = new Date(t.createdAt);
      const endTime = t.status === "selesai" ? new Date(t.updatedAt) : new Date();
      const durationMin = Math.max(1, Math.floor((endTime - startTime) / (1000 * 60)));
      const isSlaOk = durationMin <= 120;

      return [
        `TK-${t.id}`,
        t.opd?.nama || "Unmapped OPD",
        t.deskripsi_masalah || "-",
        (t.opd?.prioritas || "medium").toUpperCase(),
        `${durationMin} Mnt`,
        isSlaOk ? "Memenuhi SLA" : "Melebihi SLA",
        t.createdAt.toLocaleDateString("id-ID"),
      ];
    });

    autoTable(doc, {
      startY: 80,
      margin: { left: 15, right: 15 },
      head: [
        [
          "ID Tiket",
          "Instansi Pelapor",
          "Deskripsi Laporan",
          "Prioritas",
          "Durasi",
          "Status SLA",
          "Tanggal",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [24, 24, 27],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [39, 39, 42],
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 45 },
        3: { cellWidth: 20 },
        4: { cellWidth: 18 },
        5: { cellWidth: 25 },
        6: { cellWidth: 22 },
      },
    });

    // ----------------------------------------------------
    // HALAMAN LAMPIRAN: EVIDEN FOTO (BEFORE / AFTER)
    // ----------------------------------------------------
    doc.addPage();
    drawKopSurat();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("LAMPIRAN DOKUMENTASI EVIDEN FISIK AUDIT BPK", centerX, 45, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Dokumentasi Kondisi Sebelum (Before) dan Setelah (After) Penanganan Kendala",
      centerX,
      50,
      { align: "center" }
    );

    let currentY = 58;

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      // Jika ruang di halaman tidak cukup untuk 1 blok tiket (butuh space ~55mm), buat halaman baru
      if (currentY + 55 > pageHeight - 15) {
        doc.addPage();
        drawKopSurat();
        currentY = 45;
      }

      // Ambil Base64 Foto Before & After
      const imgBeforeBase64 = await fetchImageAsBase64(ticket.url_foto_before);
      const imgAfterBase64 = await fetchImageAsBase64(ticket.url_foto_after);

      // Box Header Tiket
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, currentY, pageWidth - 30, 8, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(24, 24, 27);
      doc.text(
        `TK-${ticket.id} | ${ticket.opd?.nama || "OPD"} (${ticket.deskripsi_masalah || "Kendala"})`,
        18,
        currentY + 5.5
      );

      // Frame Foto Before (Sebelah Kiri)
      const boxWidth = (pageWidth - 36) / 2; // ~87mm
      const boxHeight = 38;
      const beforeX = 15;
      const afterX = 15 + boxWidth + 6;
      const imgY = currentY + 11;

      // Draw Box Before
      doc.setDrawColor(212, 212, 216);
      doc.rect(beforeX, imgY, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9); // Amber
      doc.text("[SEBELUM / BEFORE]", beforeX + 3, imgY + 5);

      if (imgBeforeBase64) {
        try {
          doc.addImage(imgBeforeBase64, "JPEG", beforeX + 3, imgY + 7, boxWidth - 6, boxHeight - 10);
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(161, 161, 170);
          doc.text("Gagal memuat format foto", beforeX + 20, imgY + 20);
        }
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Foto Sebelum Tidak Tersedia", beforeX + 18, imgY + 20);
      }

      // Draw Box After
      doc.rect(afterX, imgY, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(4, 120, 87); // Emerald
      doc.text("[SETELAH / AFTER]", afterX + 3, imgY + 5);

      if (imgAfterBase64) {
        try {
          doc.addImage(imgAfterBase64, "JPEG", afterX + 3, imgY + 7, boxWidth - 6, boxHeight - 10);
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(161, 161, 170);
          doc.text("Gagal memuat format foto", afterX + 20, imgY + 20);
        }
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Foto Setelah Belum Diunggah", afterX + 18, imgY + 20);
      }

      currentY += 52; // Offset untuk tiket berikutnya
    }

    const pdfBase64 = doc.output("datauristring");

    return {
      success: true,
      data: pdfBase64,
      error: null,
    };
  } catch (error) {
    console.error("Gagal membuat PDF Laporan:", error);
    return {
      success: false,
      data: null,
      error: "Terjadi kesalahan saat memproses PDF.",
    };
  }
}

// Helper Ekspor CSV
export async function exportReportCsv() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { opd: { select: { nama: true, prioritas: true } } },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["ID Tiket,Instansi Pelapor,Deskripsi,Prioritas,Status,Tanggal Buat\n"];
    const rows = tickets.map((t) => {
      const cleanDesc = (t.deskripsi_masalah || "").replace(/,/g, " ");
      const cleanOpd = (t.opd?.nama || "").replace(/,/g, " ");
      return `TK-${t.id},${cleanOpd},${cleanDesc},${t.opd?.prioritas || "medium"},${t.status},${t.createdAt.toISOString()}\n`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("");

    return {
      success: true,
      data: encodeURI(csvContent),
      error: null,
    };
  } catch (error) {
    console.error("Gagal membuat CSV Laporan:", error);
    return {
      success: false,
      data: null,
      error: "Gagal memproses ekspor CSV.",
    };
  }
}