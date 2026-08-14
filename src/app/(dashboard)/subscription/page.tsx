"use client";

import { CreditCard, Zap, Cloud, Store, Shield, Loader2, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useState } from "react";

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

interface Plan {
  name: string;
  price_brl: number;
  max_devices: number | null;
  features: {
    online_website: boolean;
    shop_storefront: boolean;
    sync: boolean;
    shop_payments: boolean;
  };
}

export default function SubscriptionPage() {
  const { data, error, mutate } = useSWR("/tenant/plan", fetcher);
  const [upgradingTo, setUpgradingTo] = useState<string | null>(null);

  const handleUpgrade = async (planSlug: string) => {
    if (!confirm(`Confirm upgrade to ${planSlug}?`)) return;
    setUpgradingTo(planSlug);
    try {
      await fetchApi("/tenant/plan/upgrade", {
        method: "POST",
        body: JSON.stringify({ plan_slug: planSlug }),
      });
      await mutate();
    } catch (e) {
      console.error(e);
      alert("Failed to upgrade plan.");
    } finally {
      setUpgradingTo(null);
    }
  };

  if (error) {
    return <div className="text-red-500">Failed to load subscription data.</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { plan_slug, plan_name, price_brl_cents, expires_at, all_plans, features, max_devices } = data;
  const isFree = plan_slug === "free";

  const formatPrice = (cents: number) => 
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
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
                <h2 className="text-2xl font-bold text-foreground">{plan_name} Plan</h2>
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                  Active
                </span>
              </div>
              <p className="text-muted-foreground">
                {isFree ? "Free tier forever." : `Billed automatically.`}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold text-foreground">{formatPrice(price_brl_cents)}</p>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="relative z-10 py-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Your Entitlements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Terminals</p>
                  <p className="text-sm text-muted-foreground">Up to {max_devices ?? "unlimited"} devices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cloud className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Cloud Sync</p>
                  <p className="text-sm text-muted-foreground">Real-time sync {features.sync ? "enabled" : "disabled"}.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Stokiv Online</p>
                  <p className="text-sm text-muted-foreground">{features.online_website ? "Enabled" : "Upgrade required"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Shop Payments</p>
                  <p className="text-sm text-muted-foreground">{features.shop_payments ? "Enabled" : "Upgrade required"}</p>
                </div>
              </div>
            </div>
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
                <p className="text-foreground font-medium">{expires_at ? formatDate(expires_at) : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono">PIX / Card</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-xl font-bold mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(all_plans) as [string, Plan][]).map(([slug, plan]) => {
            const isCurrent = plan_slug === slug;
            return (
              <div key={slug} className={`glass rounded-xl p-6 border ${isCurrent ? 'border-primary shadow-lg shadow-primary/20' : 'border-card-border'}`}>
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold mb-6">{formatPrice(plan.price_brl)} <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {plan.max_devices ? `Up to ${plan.max_devices} devices` : "Unlimited devices"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    {plan.features.online_website ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border border-muted" />}
                    Stokiv Online
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    {plan.features.shop_storefront ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border border-muted" />}
                    Full E-commerce
                  </li>
                </ul>

                <button
                  disabled={isCurrent || upgradingTo !== null}
                  onClick={() => handleUpgrade(slug)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isCurrent 
                      ? 'bg-primary/20 text-primary cursor-default' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                  }`}
                >
                  {upgradingTo === slug ? "Upgrading..." : isCurrent ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
