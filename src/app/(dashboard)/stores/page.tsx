"use client";

import { Store, Globe, ShoppingBag, ExternalLink, Settings, MoreVertical } from "lucide-react";

export default function StoresPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Stores</h1>
          <p className="mt-2 text-muted-foreground">Manage your store identities and online presence.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Store className="w-4 h-4" />
          Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Store Card */}
        <div className="glass rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Ferramentas Silva
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wider">
                  Active
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <a href="https://tester.stokiv.online" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  tester.stokiv.online <ExternalLink className="w-3 h-3" />
                </a>
                <span className="hidden sm:inline text-card-border">•</span>
                <p className="text-sm text-muted-foreground">CNPJ: 12.345.678/0001-99</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-card-border pt-4 sm:pt-0">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <Globe className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <div className="flex flex-col items-center">
                <ShoppingBag className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-xs text-muted-foreground">Shop</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-card-border hidden sm:block"></div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Another Store Card Example */}
        <div className="glass rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-card-border flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Silva Filial (Centro)
                <span className="inline-flex items-center rounded-full bg-card-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Setup Pending
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <p className="text-sm text-muted-foreground">Not published yet</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-card-border pt-4 sm:pt-0">
            <div className="flex gap-4 opacity-40">
              <div className="flex flex-col items-center">
                <Globe className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <div className="flex flex-col items-center">
                <ShoppingBag className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Shop</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-card-border hidden sm:block"></div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
