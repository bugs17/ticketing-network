"use server";

import { prisma } from "@/lib/db";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs/promises";
import path from "path";

/**
 * Helper Server-Side untuk mengonversi URL/Path Foto menjadi Base64 & Format Gambar
 */
async function fetchImageAsBase64(urlOrPath) {
  if (!urlOrPath) return null;

  try {
    let buffer;
    let mimeType = "image/jpeg";

    // CASE 1: Jika gambar disimpan di Cloud Storage / Remote Server (http:// / https://)
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const res = await fetch(urlOrPath);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      const contentType = res.headers.get("content-type");
      if (contentType) mimeType = contentType;
    } 
    // CASE 2: Jika gambar berupa Data URI / Base64 langsung
    else if (urlOrPath.startsWith("data:image/")) {
      const matches = urlOrPath.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) return null;
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
    } 
    // CASE 3: Jika gambar disimpan di Local Storage / Public Directory (/uploads/...)
    else {
      const cleanPath = urlOrPath.startsWith("/") ? urlOrPath.substring(1) : urlOrPath;
      const absolutePath = path.join(process.cwd(), "public", cleanPath);

      buffer = await fs.readFile(absolutePath);

      if (cleanPath.endsWith(".png")) mimeType = "image/png";
      else if (cleanPath.endsWith(".webp")) mimeType = "image/webp";
    }

    const format = mimeType.includes("png") ? "PNG" : "JPEG";
    const base64String = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return {
      base64: base64String,
      format: format,
    };
  } catch (error) {
    console.warn(`Gagal memuat foto dari path/URL: ${urlOrPath}`, error);
    return null;
  }
}

/**
 * Server Action: Generasi PDF Bukti Fisik Audit Single Tiket (A4)
 */
export async function exportSingleTicketPdf(ticketId) {
  try {
    const numericId = typeof ticketId === "string" ? parseInt(ticketId.replace(/\D/g, ""), 10) : ticketId;

    // 1. Query Detail Tiket dari Database
    const ticket = await prisma.ticket.findUnique({
      where: { id: numericId },
      include: { opd: true },
    });

    if (!ticket) {
      return { success: false, data: null, error: "Tiket tidak ditemukan." };
    }

    // 2. Load Logo Kop Surat
    let komdigiBase64 = null;
    let mimikaBase64 = null;

    try {
      const komdigiBuffer = await fs.readFile(path.join(process.cwd(), "public", "logo_komdigi.png"));
      komdigiBase64 = `data:image/png;base64,${komdigiBuffer.toString("base64")}`;
    } catch (e) {}

    try {
      const mimikaBuffer = await fs.readFile(path.join(process.cwd(), "public", "logo_mimika.jpg"));
      mimikaBase64 = `data:image/jpeg;base64,${mimikaBuffer.toString("base64")}`;
    } catch (e) {}

    // 3. Inisialisasi Dokumen PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    // --- DRAW KOP SURAT ---
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

    // Line Divider Kop
    doc.setDrawColor(24, 24, 27);
    doc.setLineWidth(0.8);
    doc.line(15, 36, pageWidth - 15, 36);
    doc.setLineWidth(0.2);
    doc.line(15, 37.2, pageWidth - 15, 37.2);

    // --- JUDUL DOKUMEN ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BERKAS BUKTI FISIK LAPANGAN & KEPATUHAN SLA", centerX, 45, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text(`Dokumen Pendukung Audit BPK — Nomor Tiket: TK-${ticket.id}`, centerX, 50, { align: "center" });

    // --- METADATA TIKET ---
    const startTime = new Date(ticket.createdAt);
    const endTime = ticket.status === "selesai" ? new Date(ticket.updatedAt) : new Date();
    const durationMin = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)));
    const isSlaOk = durationMin <= 120;

    autoTable(doc, {
      startY: 56,
      margin: { left: 15, right: 15 },
      theme: "plain",
      styles: { fontSize: 8.5, cellPadding: 2.5 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [113, 113, 122], cellWidth: 45 },
        1: { textColor: [24, 24, 27] },
      },
      body: [
        ["Instansi Pelapor (OPD)", `: ${ticket.opd?.nama || "Unmapped OPD"}`],
        ["Waktu Laporan Masuk", `: ${startTime.toLocaleString("id-ID")}`],
        ["Status Penanganan / SLA", `: ${isSlaOk ? "MEMENUHI SLA (Tepat Waktu)" : "MELEBIHI SLA (Terlambat)"} (${durationMin} Menit)`],
        ["Prioritas & Kategori", `: ${(ticket.opd?.prioritas || "MEDIUM").toUpperCase()} — ${ticket.deskripsi_masalah || "-"}`],
      ],
    });

    // --- EVIDEN FOTO (BEFORE / AFTER) ---
    const imgBeforeBase64 = await fetchImageAsBase64(ticket.url_foto_before);
    const imgAfterBase64 = await fetchImageAsBase64(ticket.url_foto_after);

    const startYImages = doc.lastAutoTable.finalY + 8;
    const boxWidth = (pageWidth - 36) / 2;
    const boxHeight = 70;
    const beforeX = 15;
    const afterX = 15 + boxWidth + 6;

    // Frame Before
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(beforeX, startYImages, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text("[BEFORE] KONDISI SEBELUM PERBAIKAN", beforeX + 4, startYImages + 6);

    if (imgBeforeBase64) {
      try {
        doc.addImage(imgBeforeBase64, "JPEG", beforeX + 4, startYImages + 9, boxWidth - 8, boxHeight - 14);
      } catch (e) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Gagal memuat gambar", beforeX + 25, startYImages + 35);
      }
    } else {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(161, 161, 170);
      doc.text("Foto Sebelum Tidak Tersedia", beforeX + 22, startYImages + 35);
    }

    // Frame After
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(afterX, startYImages, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61);
    doc.text("[AFTER] KONDISI SETELAH PERBAIKAN", afterX + 4, startYImages + 6);

    if (imgAfterBase64) {
      try {
        doc.addImage(imgAfterBase64, "JPEG", afterX + 4, startYImages + 9, boxWidth - 8, boxHeight - 14);
      } catch (e) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Gagal memuat gambar", afterX + 25, startYImages + 35);
      }
    } else {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(161, 161, 170);
      doc.text("Foto Setelah Belum Diunggah", afterX + 20, startYImages + 35);
    }

    // --- FOOTER DOKUMEN ---
    const footerY = startYImages + boxHeight + 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(161, 161, 170);
    doc.text(
      `Dicetak secara otomatis dari Sistem Audit SLA Diskominfo Mimika pada ${new Date().toLocaleString("id-ID")}`,
      centerX,
      footerY,
      { align: "center" }
    );

    const pdfBase64 = doc.output("datauristring");

    return {
      success: true,
      data: pdfBase64,
      error: null,
    };
  } catch (error) {
    console.error("Gagal export single ticket PDF:", error);
    return {
      success: false,
      data: null,
      error: "Terjadi kesalahan saat memproses PDF tiket.",
    };
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
      const startTime = new Date(t.createdAt).getTime();
      const endTime = t.status === "selesai" ? new Date(t.updatedAt).getTime() : new Date().getTime();
      const durationMin = Math.max(1, Math.floor((endTime - startTime) / (1000 * 60)));
      const isSlaOk = durationMin <= 120;

      return [
        `TK-${t.id}`,
        t.opd?.nama || "Unmapped OPD",
        t.deskripsi_masalah || "-",
        (t.opd?.prioritas || "medium").toUpperCase(),
        `${durationMin} Mnt`,
        isSlaOk ? "Memenuhi SLA" : "Melebihi SLA",
        new Date(t.createdAt).toLocaleDateString("id-ID"),
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
    doc.text("LAMPIRAN DOKUMENTASI EVIDEN FISIK AUDIT", centerX, 45, {
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

      // Jika ruang di halaman tidak cukup (~55mm), buat halaman baru
      if (currentY + 55 > pageHeight - 15) {
        doc.addPage();
        drawKopSurat();
        currentY = 45;
      }

      // Fetch Base64 secara asinkron di Server
      const imgBefore = await fetchImageAsBase64(ticket.url_foto_before);
      const imgAfter = await fetchImageAsBase64(ticket.url_foto_after);

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

      const boxWidth = (pageWidth - 36) / 2; // ~87mm
      const boxHeight = 38;
      const beforeX = 15;
      const afterX = 15 + boxWidth + 6;
      const imgY = currentY + 11;

      // --- RENDER BOX & FOTO BEFORE ---
      doc.setDrawColor(212, 212, 216);
      doc.rect(beforeX, imgY, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9); // Amber
      doc.text("[SEBELUM / BEFORE]", beforeX + 3, imgY + 5);

      if (imgBefore) {
        try {
          doc.addImage(
            imgBefore.base64,
            imgBefore.format,
            beforeX + 3,
            imgY + 7,
            boxWidth - 6,
            boxHeight - 10
          );
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(161, 161, 170);
          doc.text("Gagal memuat format foto", beforeX + 20, imgY + 22);
        }
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Foto Sebelum Tidak Tersedia", beforeX + 18, imgY + 22);
      }

      // --- RENDER BOX & FOTO AFTER ---
      doc.rect(afterX, imgY, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(4, 120, 87); // Emerald
      doc.text("[SETELAH / AFTER]", afterX + 3, imgY + 5);

      if (imgAfter) {
        try {
          doc.addImage(
            imgAfter.base64,
            imgAfter.format,
            afterX + 3,
            imgY + 7,
            boxWidth - 6,
            boxHeight - 10
          );
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(161, 161, 170);
          doc.text("Gagal memuat format foto", afterX + 20, imgY + 22);
        }
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(161, 161, 170);
        doc.text("Foto Setelah Belum Diunggah", afterX + 18, imgY + 22);
      }

      currentY += 52;
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