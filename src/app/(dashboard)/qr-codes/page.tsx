"use client";

import { QrCode, Plus, Trash2, Loader2, Store, Utensils, Package, Download, Printer } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { TableTentPrint } from "@/components/TableTentPrint";

interface QrCodeData {
  ulid: string;
  public_code: string;
  type: "store" | "table" | "product";
  target_id: string;
  is_active: boolean;
  store: { name: string; slug: string } | null;
  created_at: string;
}

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

export default function QrCodesPage() {
  const { data, error, isLoading, mutate } = useSWR("/qr-codes", fetcher);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printingQr, setPrintingQr] = useState<QrCodeData | null>(null);

  const getQrUrl = (qr: QrCodeData) => {
    const shopDomain = qr.store?.slug || 'tester';
    const base = `https://${shopDomain}.stokiv.shop`;
    if (qr.type === 'store') return base;
    if (qr.type === 'product') return `${base}/p/${qr.public_code}`;
    return `${base}/t/${qr.public_code}`;
  };

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<"store" | "table" | "product">("table");
  const [storeId, setStoreId] = useState("");
  const [targetId, setTargetId] = useState("");
  
  // Data for selects
  const { data: storesData } = useSWR(modalOpen ? "/stores" : null, fetcher);
  const { data: tablesData } = useSWR(modalOpen && type === "table" ? "/tables" : null, fetcher);
  const { data: productsData } = useSWR(modalOpen && type === "product" ? "/products" : null, fetcher);

  const stores = storesData?.data || storesData || [];
  const tables = tablesData?.data || tablesData || [];
  const products = productsData?.data || productsData || [];

  const qrCodes: QrCodeData[] = data?.data || data || [];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !targetId) return;

    setIsGenerating(true);
    try {
      await fetchApi("/qr-codes", {
        method: "POST",
        body: JSON.stringify({ type, store_id: storeId, target_id: targetId }),
      });
      await mutate();
      setModalOpen(false);
      setTargetId("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (ulid: string) => {
    if (!confirm("Are you sure you want to delete this QR Code?")) return;
    try {
      await fetchApi(`/qr-codes/${ulid}`, { method: "DELETE" });
      mutate();
    } catch {
      alert("Failed to delete QR Code");
    }
  };

  const downloadSVG = (code: string) => {
    const svg = document.getElementById(`qr-${code}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${code}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = (qr: QrCodeData) => {
    setPrintingQr(qr);
    setTimeout(() => {
      window.print();
      setPrintingQr(null);
    }, 300);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">QR Codes</h1>
          <p className="mt-2 text-muted-foreground">Manage and generate QR codes for tables, products, and storefronts.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate QR Code
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden print:hidden">
        {isLoading && (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && error && (
          <div className="p-12 flex items-center justify-center text-red-400">
            Failed to load QR codes.
          </div>
        )}

        {!isLoading && !error && qrCodes.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
            <QrCode className="w-12 h-12 mb-4 opacity-20" />
            <p>No QR codes generated yet.</p>
          </div>
        )}

        {!isLoading && qrCodes.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Visual</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Store</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {qrCodes.map((qr) => (
                <tr key={qr.ulid} className="border-b border-card-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="bg-white p-2 rounded-lg inline-block shadow-sm">
                      <QRCodeSVG 
                        id={`qr-${qr.public_code}`}
                        value={getQrUrl(qr)} 
                        size={64} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-lg font-bold text-foreground tracking-wider">{qr.public_code}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <div className="flex items-center gap-2">
                      {qr.type === 'store' && <Store className="w-4 h-4 text-primary" />}
                      {qr.type === 'table' && <Utensils className="w-4 h-4 text-blue-400" />}
                      {qr.type === 'product' && <Package className="w-4 h-4 text-purple-400" />}
                      {qr.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {qr.store?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => downloadSVG(qr.public_code)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Download PNG"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePrint(qr)}
                        className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Print Table Tent"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(qr.ulid)}
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete QR"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-card-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-card-border">
              <h2 className="text-xl font-bold text-foreground">Generate New QR Code</h2>
            </div>
            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Store</label>
                <select 
                  required
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="">Select a store...</option>
                  {stores.map((s: { ulid: string; name: string }) => (
                    <option key={s.ulid} value={s.ulid}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                <select 
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as "store" | "table" | "product");
                    setTargetId("");
                  }}
                  className="w-full bg-[#1a1a1a] border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="table">Restaurant Table</option>
                  <option value="store">Storefront</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {type !== "store" && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    {type === "table" ? "Table" : "Product"}
                  </label>
                  <select 
                    required
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="">Select a {type}...</option>
                    {type === "table" && tables.filter((t: { store_id?: string; ulid: string; name: string }) => t.store_id === storeId || !storeId).map((t: { store_id?: string; ulid: string; name: string }) => (
                      <option key={t.ulid} value={t.ulid}>{t.name}</option>
                    ))}
                    {type === "product" && products.map((p: { ulid: string; name: string }) => (
                      <option key={p.ulid} value={p.ulid}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === "store" && storeId && (() => {
                 if (targetId !== storeId) setTargetId(storeId);
                 return null;
              })()}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-white/5 transition-colors border border-transparent hover:border-card-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !storeId || !targetId}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TableTentPrint qr={printingQr} />
    </div>
  );
}
