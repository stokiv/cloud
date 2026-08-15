import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface TableTentPrintProps {
  qr: {
    public_code: string;
    type: "store" | "table" | "product";
    target_id: string;
    store: { name: string } | null;
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

  const shopDomain = qr.store?.name ? qr.store.name.toLowerCase() : 'tester';
  const qrUrl = `https://${shopDomain}.stokiv.shop/t/${qr.public_code}`;

  return (
    <div className="hidden print:flex flex-col items-center justify-center w-screen h-screen bg-white text-black p-12 absolute inset-0 z-[9999]">
      <div className="border-[8px] border-black p-16 flex flex-col items-center justify-center w-full max-w-2xl h-full max-h-[80vh] rounded-[40px]">
        <div className="text-4xl font-bold uppercase tracking-widest mb-4">
          {qr.store?.name || "Stokiv Shop"}
        </div>
        
        <div className="text-2xl text-gray-600 mb-12">
          {getTargetName()}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm mb-12">
          <QRCodeSVG 
            value={qrUrl}
            size={400} 
            level="H"
          />
        </div>

        <div className="text-4xl font-black text-center max-w-sm leading-tight">
          ESCANEIE PARA FAZER O SEU PEDIDO
        </div>
      </div>
    </div>
  );
}
