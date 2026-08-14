"use client";

import { CloudSync, AlertTriangle, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

interface SyncStatus {
  status: string;
  active_devices: number;
  conflicts: number;
  conflicted_items: unknown[];
}

export default function SyncPage() {
  const { data: res, isLoading, mutate } = useSWR("/sync/status", fetchApi);
  const status: SyncStatus = res?.data || { status: "operational", active_devices: 0, conflicts: 0, conflicted_items: [] };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cloud Synchronization</h1>
          <p className="mt-2 text-muted-foreground">Monitor your offline-first sync status across all devices.</p>
        </div>
        <button 
          onClick={() => mutate()}
          disabled={isLoading}
          className="bg-card border border-card-border text-foreground px-4 py-2 rounded-lg font-medium hover:bg-card/80 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-muted-foreground mb-4 animate-spin" />
          ) : status.status === "operational" ? (
            <CloudSync className="w-12 h-12 text-green-500 mb-4" />
          ) : (
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          )}
          <h3 className="font-bold text-lg">
            {isLoading ? "Checking Status..." : status.status === "operational" ? "System Operational" : "System Issues"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Stokiv Cloud sync services are running normally.</p>
        </div>
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-muted-foreground mb-4 animate-spin" />
          ) : status.active_devices > 0 ? (
            <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
          ) : (
            <CloudSync className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          )}
          <h3 className="font-bold text-lg">
            {isLoading ? "Loading..." : `${status.active_devices} Devices Synced`}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Active in the last 24 hours.</p>
        </div>
        <div className="glass rounded-xl p-6 flex flex-col items-center justify-center text-center">
          {isLoading ? (
             <Loader2 className="w-12 h-12 text-muted-foreground mb-4 animate-spin" />
          ) : status.conflicts > 0 ? (
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          ) : (
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
          )}
          <h3 className="font-bold text-lg">
            {isLoading ? "Loading..." : `${status.conflicts} Conflict${status.conflicts !== 1 ? 's' : ''} Detected`}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {status.conflicts > 0 ? "Requires manual resolution." : "All data is consistent."}
          </p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden mt-8">
        <div className="p-4 sm:p-6 border-b border-card-border">
          <h2 className="text-xl font-bold text-foreground">Sync Conflicts</h2>
          <p className="text-sm text-muted-foreground mt-1">These items were modified simultaneously on different offline devices.</p>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : status.conflicts === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No sync conflicts detected. Your data is perfectly synchronized.</p>
            </div>
          ) : (
            // Render conflicts here when implemented
            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4">
              {/* Dummy conflict for UI purposes if there are any */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
