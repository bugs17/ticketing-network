"use client"

import { Download, Printer, X } from "lucide-react";
import { useRef } from "react";

    const getQrUrl = (token) => {
        const targetUrl = `https://nettick.gov/report?client=${token}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}&margin=10`;
    };

const PreviewDanPrintQR = ({isModalOpen, selectedOpd, setIsModalOpen}) => {
    if (!isModalOpen || !selectedOpd) {
        return null;
    }
    const printAreaRef = useRef(null);


    

    const handlePrint = () => {
        const printContent = printAreaRef.current.innerHTML;
        const win = window.open("", "_blank", "width=600,height=600");
        win.document.write(`
        <html>
            <head>
            <title>Cetak Stiker QR - ${selectedOpd?.nama}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @media print {
                body { margin: 0; padding: 20px; }
                }
            </style>
            </head>
            <body class="flex items-center justify-center min-h-screen bg-white">
            <div class="w-[320px] p-6 border-2 border-dashed border-zinc-300 rounded-2xl text-center bg-white">
                ${printContent}
            </div>
            <script>
                window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
                };
            </script>
            </body>
        </html>
        `);
        win.document.close();
    };

    // Unduh Handler
    const handleDownloadQr = () => {
            if (!selectedOpd) return;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const width = 400;
            const height = 520;
            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
            
            ctx.strokeStyle = "#E4E4E7";
            ctx.lineWidth = 4;
            ctx.strokeRect(10, 10, width - 20, height - 20);

            ctx.textAlign = "center";
            ctx.fillStyle = "#A1A1AA";
            ctx.font = "bold 11px monospace";
            ctx.fillText("NOC NETTICK SYSTEM", width / 2, 45);

            ctx.fillStyle = "#09090B";
            ctx.font = "bold 16px sans-serif";
            const displayName = selectedOpd.nama.length > 30 
            ? selectedOpd.nama.substring(0, 28) + "..." 
            : selectedOpd.nama;
            ctx.fillText(displayName, width / 2, 75);

            ctx.fillStyle = "#71717A";
            ctx.font = "500 12px sans-serif";
            // ctx.fillText(selectedOpd.location, width / 2, 95);

            const qrImage = new Image();
            qrImage.crossOrigin = "anonymous";
            qrImage.src = getQrUrl(selectedOpd.token_qr);

            qrImage.onload = () => {
            const qrSize = 220;
            const qrX = (width - qrSize) / 2;
            const qrY = 125;

            ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

            ctx.fillStyle = "#71717A";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("PINDAI UNTUK LAPOR GANGGUAN", width / 2, 385);

            const badgeText = selectedOpd.token_qr;
            ctx.font = "bold 15px monospace";
            const textWidth = ctx.measureText(badgeText).width;
            
            const badgeWidth = textWidth + 30;
            const badgeHeight = 35;
            const badgeX = (width - badgeWidth) / 2;
            const badgeY = 405;

            ctx.fillStyle = "#F4F4F5";
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8);
            ctx.fill();
            
            ctx.strokeStyle = "#E4E4E7";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#18181B";
            ctx.textBaseline = "middle";
            ctx.fillText(badgeText, width / 2, badgeY + (badgeHeight / 2));

            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = `STIKER-${selectedOpd.token_qr}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            };
        };
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden flex flex-col scale-[1.01] transition-transform">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-800 tracking-tight">Stiker QR Laporan</span>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-zinc-50/50">
              <div 
                ref={printAreaRef}
                className="w-full max-w-[280px] bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex flex-col items-center text-center"
              >
                <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">NOC NETTICK SYSTEM</span>
                <h4 className="text-xs font-extrabold text-zinc-900 mt-1 max-w-[220px] truncate">
                  {selectedOpd.nama}
                </h4>
                {/* <p className="text-[9px] text-zinc-400 mt-0.5">{selectedOpd.location}</p> */}

                <div className="my-5 p-2 bg-white border border-zinc-100 rounded-xl shadow-inner flex items-center justify-center">
                  <img 
                    src={getQrUrl(selectedOpd.token_qr)} 
                    alt="QR Code" 
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-zinc-400 block uppercase tracking-wider">PINDAI UNTUK LAPOR GANGGUAN</span>
                  <div className="font-mono text-xs font-extrabold text-zinc-800 tracking-wider bg-zinc-50 border border-zinc-150 py-1 px-3 rounded-lg inline-block">
                    {selectedOpd.token_qr}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 text-center mt-4 max-w-[240px]">
                Gunakan printer label thermal untuk hasil stiker tempel terbaik.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 border-t border-zinc-100 bg-white">
              <button
                onClick={handleDownloadQr}
                className="cursor-pointer bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh QR
              </button>
              
              <button
                onClick={handlePrint}
                className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-zinc-100"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Stiker
              </button>
            </div>
          </div>
        </div>
  )
}

export default PreviewDanPrintQR