"use client";

import { CreditCard, Store, MonitorSmartphone, CloudSync, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Lucas</h1>
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
            <p className="text-4xl font-bold text-foreground mb-1 tracking-tight">3</p>
            <p className="text-sm text-muted-foreground">out of 5 limit</p>
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
            <p className="text-4xl font-bold text-foreground mb-1 tracking-tight">5</p>
            <p className="text-sm text-muted-foreground">Active in last 24h</p>
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
            <p className="text-sm text-muted-foreground">Last synced 2m ago</p>
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
                <p className="text-sm text-foreground">Published <span className="font-medium">Ferramentas Silva</span> to stokiv.online</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <MonitorSmartphone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">New device <span className="font-medium">iPhone 14 Pro</span> authorized</p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday at 14:32</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <CreditCard className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">Payment of <span className="font-medium">$29.00</span> successful</p>
                <p className="text-xs text-muted-foreground mt-1">Aug 14, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <Store className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Add New Store</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Upgrade Plan</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <MonitorSmartphone className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Revoke Device</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-card-border bg-card/50 hover:bg-card/80 transition-colors gap-2">
              <CloudSync className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Resolve Sync Conflicts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
