"use client";

import { CreditCard, ExternalLink, FileText, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { fetchApi } from "@/lib/api";

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePortal = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/billing/portal", { method: "POST" });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error(e);
      alert("Billing portal is unavailable or you have not subscribed via Stripe yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const invoices = [
    { id: "INV-2023-08", date: "Aug 1, 2023", amount: "$29.00", status: "Paid", downloadUrl: "#" },
    { id: "INV-2023-07", date: "Jul 1, 2023", amount: "$29.00", status: "Paid", downloadUrl: "#" },
    { id: "INV-2023-06", date: "Jun 1, 2023", amount: "$29.00", status: "Paid", downloadUrl: "#" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing History</h1>
          <p className="mt-2 text-muted-foreground">View your past invoices and manage your payment methods.</p>
        </div>
        
        <button 
          onClick={handlePortal}
          disabled={isLoading}
          className="bg-card text-foreground border border-card-border px-4 py-2 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Customer Portal
          <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-medium text-foreground">Invoices</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-card-border">
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Invoice</th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={invoice.downloadUrl}
                      className="inline-flex items-center p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-white/5 text-center border-t border-card-border">
          <p className="text-sm text-muted-foreground">
            Looking for older invoices? Visit the <Link href="#" className="text-primary hover:underline">Customer Portal</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
