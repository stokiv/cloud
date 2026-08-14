"use client";

import { CreditCard, Store, MonitorSmartphone, CloudSync, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: enterpriseData, isLoading: enterpriseLoading } = useSWR("/dashboard/enterprise", fetcher);
  // Re-use devices fetcher for total device count
  const { data: devicesData, isLoading: devicesLoading } = useSWR("/tenant/devices", fetcher);

  const stats = enterpriseData?.data || enterpriseData;
  const devices = devicesData?.data || devicesData || [];
  
  const totalStores = stats?.total_stores || 0;
  const activeStores = stats?.active_stores || 0;
  
  const activeDevices = devices.filter((d: any) => 
    d.status === 'ACTIVE' && d.last_sync_at && 
    (new Date().getTime() - new Date(d.last_sync_at).getTime() < 1000 * 60 * 60 * 24) // Active in last 24h
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-muted-foreground">Here is what is happening with your Stokiv account today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Plan */}
        <div className="glass rounded-xl p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-medium">Current Plan</h2>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold text-foreground mb-1 tracking-tight">Pro</p>
            <p className="text-sm text-green-500 font-medium">Active • Renews Sept 14</p>
          </div>
          <Link href="/subscription" className="mt-6 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors relative z-10">
            Manage Subscription <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Stores */}
        <div className="glass rounded-xl p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Store className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="font-medium">Stores</h2>
          </div>
          <div className="relative z-10">
            {enterpriseLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <p className="text-4xl font-bold text-foreground mb-1 tracking-tight">{totalStores}</p>
                <p className="text-sm text-muted-foreground">{activeStores} active</p>
              </>
            )}
          </div>
          <Link href="/stores" className="mt-6 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors relative z-10">
            View Stores <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Devices */}
        <div className="glass rounded-xl p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MonitorSmartphone className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <MonitorSmartphone className="w-5 h-5 text-primary" />
            <h2 className="font-medium">Devices</h2>
          </div>
          <div className="relative z-10">
            {devicesLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <p className="text-4xl font-bold text-foreground mb-1 tracking-tight">{devices.length}</p>
                <p className="text-sm text-muted-foreground">{activeDevices} Active in last 24h</p>
              </>
            )}
          </div>
          <Link href="/devices" className="mt-6 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors relative z-10">
            Manage Devices <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Sync Status */}
        <div className="glass rounded-xl p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CloudSync className="w-24 h-24 text-green-500 transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground mb-4 relative z-10">
            <CloudSync className="w-5 h-5 text-green-500" />
            <h2 className="font-medium">Cloud Sync</h2>
          </div>
          <div className="relative z-10">
            <p className="text-xl font-bold text-foreground mb-1 tracking-tight">All Good</p>
            <p className="text-sm text-muted-foreground">Operational</p>
          </div>
          <Link href="/sync" className="mt-6 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors relative z-10">
            View Sync Logs <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">You signed in to <span className="font-medium">Stokiv Cloud</span></p>
                <p className="text-xs text-muted-foreground mt-1">Just now</p>
              </div>
            </div>
            {devices.slice(0, 1).map((device: any) => (
              <div key={device.ulid} className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <MonitorSmartphone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground">Device <span className="font-medium">{device.name}</span> synced</p>
                  <p className="text-xs text-muted-foreground mt-1">{device.last_sync_at ? new Date(device.last_sync_at).toLocaleString() : 'Recently'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/stores" className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <Store className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Add New Store</span>
            </Link>
            <Link href="/subscription" className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Upgrade Plan</span>
            </Link>
            <Link href="/devices" className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <MonitorSmartphone className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Manage Devices</span>
            </Link>
            <Link href="/sync" className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <CloudSync className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Resolve Sync Conflicts</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
