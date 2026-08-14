"use client";

import { Laptop, Smartphone, Search, ShieldAlert, Loader2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface Device {
  ulid: string;
  name: string;
  status: string;
  last_sync_at: string | null;
  workstation_role: string;
}

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

export default function DevicesPage() {
  const { data, error, isLoading, mutate } = useSWR("/tenant/devices", fetcher);

  const handleRevoke = async (ulid: string) => {
    if (!confirm("Are you sure you want to revoke access for this device?")) return;
    
    try {
      await fetchApi(`/tenant/devices/${ulid}/revoke`, { method: "POST" });
      mutate(); // Refresh the list
    } catch (err) {
      alert("Failed to revoke device.");
    }
  };

  const devices: Device[] = data?.data || []; // Assuming Laravel pagination returns data.data

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
        
        <div className="divide-y divide-card-border min-h-[200px] flex flex-col">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex-1 flex items-center justify-center p-8 text-red-400">
              Failed to load devices.
            </div>
          )}

          {!isLoading && !error && devices.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
              No devices found.
            </div>
          )}

          {!isLoading && devices.map((device) => {
            const isOnline = device.status === 'ACTIVE' && device.last_sync_at && 
              (new Date().getTime() - new Date(device.last_sync_at).getTime() < 1000 * 60 * 15); // 15 mins

            return (
              <div key={device.ulid} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${device.status === 'REVOKED' ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                    {device.workstation_role === 'MOBILE' ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-lg flex items-center gap-2">
                      {device.name}
                      {device.status === 'REVOKED' ? (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500 uppercase tracking-wider">
                          Revoked
                        </span>
                      ) : isOnline ? (
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wider">
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-card-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          Offline
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Role: {device.workstation_role || 'General'}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last sync: {device.last_sync_at ? formatDistanceToNow(new Date(device.last_sync_at), { addSuffix: true }) : 'Never'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {device.status !== 'REVOKED' && (
                    <button 
                      onClick={() => handleRevoke(device.ulid)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" /> Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
