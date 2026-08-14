"use client";

import { Laptop, Smartphone, Search, ShieldAlert } from "lucide-react";

export default function DevicesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Devices</h1>
          <p className="mt-2 text-muted-foreground">Manage authorized devices syncing with your Stokiv Cloud.</p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-card-border flex items-center justify-between bg-card/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search devices..." 
              className="w-full bg-background border border-card-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>
        </div>
        
        <div className="divide-y divide-card-border">
          {/* Device 1 */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-lg flex items-center gap-2">
                  MacBook Pro (Caixa 1)
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wider">
                    Online
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">macOS 14.5 • Stokiv App v2.4.1</p>
                <p className="text-xs text-muted-foreground mt-2">Last sync: 2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button className="text-sm px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Revoke
              </button>
            </div>
          </div>

          {/* Device 2 */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-lg flex items-center gap-2">
                  Windows PC (Estoque)
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wider">
                    Online
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Windows 11 • Stokiv App v2.4.1</p>
                <p className="text-xs text-muted-foreground mt-2">Last sync: 14 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button className="text-sm px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Revoke
              </button>
            </div>
          </div>

          {/* Device 3 */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-card-border rounded-xl text-muted-foreground shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-lg flex items-center gap-2">
                  Android (João)
                  <span className="inline-flex items-center rounded-full bg-card-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Offline
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Android 14 • Stokiv App v2.4.0</p>
                <p className="text-xs text-muted-foreground mt-2">Last sync: 3 days ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button className="text-sm px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
