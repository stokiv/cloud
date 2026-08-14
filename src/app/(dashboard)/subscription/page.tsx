"use client";

import { CreditCard, ArrowRight, Zap, Cloud, Store, Shield } from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription & Entitlements</h1>
        <p className="mt-2 text-muted-foreground">Manage your current plan and features across all your Stokiv devices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Overview */}
        <div className="lg:col-span-2 glass rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-48 h-48 text-primary transform rotate-12 translate-x-12 -translate-y-12" />
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-card-border pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">Professional Plan</h2>
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                  Active
                </span>
              </div>
              <p className="text-muted-foreground">Billed through <span className="text-foreground font-medium">Apple App Store</span></p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold text-foreground">$29.00</p>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="relative z-10 py-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Your Entitlements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Multi-Store (Up to 3)</p>
                  <p className="text-sm text-muted-foreground">Manage inventory across multiple locations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cloud className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Cloud Sync</p>
                  <p className="text-sm text-muted-foreground">Real-time sync between 10 devices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Stokiv Online</p>
                  <p className="text-sm text-muted-foreground">Your own digital storefront.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Advanced Roles</p>
                  <p className="text-sm text-muted-foreground">Granular permissions for your team.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 border-t border-card-border pt-6">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Upgrade Plan
            </button>
            <button className="bg-card border border-card-border text-foreground px-6 py-2 rounded-lg font-medium hover:bg-card/80 transition-colors">
              Manage in App Store
            </button>
          </div>
        </div>

        {/* Next Billing */}
        <div className="glass rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Billing Info</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Billing Date</p>
                <p className="text-foreground font-medium">September 14, 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Apple Pay</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">Managed securely by Apple.</p>
              </div>
            </div>
          </div>

          <Link href="/billing" className="mt-8 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View Billing History <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Plans comparison could go here... */}
    </div>
  );
}
