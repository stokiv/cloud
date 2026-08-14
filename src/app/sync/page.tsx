"use client";

import { CloudSync, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";

export default function SyncPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cloud Synchronization</h1>
          <p className="mt-2 text-muted-foreground">Monitor your offline-first sync status across all devices.</p>
        </div>
        <button className="bg-card border border-card-border text-foreground px-4 py-2 rounded-lg font-medium hover:bg-card/80 transition-colors flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Force Sync
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <CloudSync className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="font-bold text-lg">System Operational</h3>
          <p className="text-sm text-muted-foreground mt-1">Stokiv Cloud sync services are running normally.</p>
        </div>
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
          <h3 className="font-bold text-lg">2 Devices Synced</h3>
          <p className="text-sm text-muted-foreground mt-1">Up to date with the cloud.</p>
        </div>
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="font-bold text-lg">1 Conflict Detected</h3>
          <p className="text-sm text-muted-foreground mt-1">Requires manual resolution.</p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden mt-8">
        <div className="p-4 sm:p-6 border-b border-card-border">
          <h2 className="text-xl font-bold text-foreground">Sync Conflicts</h2>
          <p className="text-sm text-muted-foreground mt-1">These items were modified simultaneously on different offline devices.</p>
        </div>
        
        <div className="p-6">
          <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Product &quot;Cabo Flexível&quot;</h4>
                <p className="text-sm text-muted-foreground mt-1">Price conflict detected between two devices.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-card/50 border border-card-border rounded p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Cloud State (Current)</p>
                    <p className="font-mono text-sm">Price: R$ 290.00</p>
                    <p className="text-xs text-muted-foreground mt-1">Last edited by João</p>
                    <button className="mt-3 w-full py-1.5 bg-card border border-card-border hover:bg-card/80 text-sm rounded transition-colors">
                      Keep Cloud
                    </button>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded p-3 relative">
                    <div className="absolute -top-2.5 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      MacBook Pro
                    </div>
                    <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">Local State (Conflicted)</p>
                    <p className="font-mono text-sm text-foreground">Price: R$ 280.00</p>
                    <p className="text-xs text-muted-foreground mt-1">Last edited by Lucas</p>
                    <button className="mt-3 w-full py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded transition-colors">
                      Keep Local
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
