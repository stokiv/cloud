import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface TableTentPrintProps {
  qr: {
    public_code: string;
    type: "store" | "table" | "product";
    target_id: string;
    branding?: { color?: string; logo_url?: string };
    store: { name: string; slug: string } | null;
  } | null;
}

export function TableTentPrint({ qr }: TableTentPrintProps) {
  if (!qr) return null;

  const getTargetName = () => {
    // In a real scenario, we might have the actual table name if we joined it in the response.
    // For now, if we don't have it explicitly mapped in the qr payload beyond target_id,
    // we can just display "Faça seu Pedido".
    if (qr.type === "table") return "Mesa";
    if (qr.type === "product") return "Produto";
    return "Bem-vindo!";
  };

  const shopDomain = qr.store?.slug || 'tester';
  const base = `https://${shopDomain}.stokiv.shop`;
  let qrUrl = `${base}/t/${qr.public_code}`;
  if (qr.type === 'store') qrUrl = base;
  if (qr.type === 'product') qrUrl = `${base}/p/${qr.public_code}`;

  return (
    <div className="hidden print:flex flex-col items-center justify-center w-screen h-screen bg-white text-black p-12 absolute inset-0 z-[9999]">
      <div className="border-[8px] border-black p-16 flex flex-col items-center justify-center w-full max-w-2xl h-full max-h-[80vh] rounded-[40px]">
        <div className="text-4xl font-bold uppercase tracking-widest mb-4">
          {qr.store?.name || "Stokiv Shop"}
        </div>
        
        <div className="text-2xl text-gray-600 mb-12">
          {getTargetName()}
        </div>

        <div className="bg-white p-4 rounded-3xl inline-block mt-8 mb-4">
          <QRCodeSVG 
            id={`qr-print-${qr.public_code}`}
            value={qrUrl} 
            size={400} 
            fgColor={qr.branding?.color || "#000000"}
            imageSettings={qr.branding?.logo_url ? { src: qr.branding.logo_url, height: 80, width: 80, excavate: true } : undefined}
          />
        </div>

        <div className="text-4xl font-black text-center max-w-sm leading-tight">
          ESCANEIE PARA FAZER O SEU PEDIDO
        </div>
      </div>
    </div>
  );
}
