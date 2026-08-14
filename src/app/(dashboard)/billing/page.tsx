"use client";

import { CreditCard, ExternalLink, FileText, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { fetchApi } from "@/lib/api";
import useSWR from "swr";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  downloadUrl: string;
}

export default function BillingPage() {
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  // Fetch subscription and invoices
  const { data: subRes, isLoading: isSubLoading } = useSWR("/billing/subscription", fetchApi);
  const { data: invRes, isLoading: isInvoicesLoading } = useSWR("/billing/invoices", fetchApi);
  
  const subscription = subRes?.data || null;
  const invoices: Invoice[] = invRes?.data || [];

  const handlePortal = async () => {
    setIsLoadingPortal(true);
    try {
      const res = await fetchApi("/billing/portal", { method: "POST" });
      if (res.data?.portal_url) {
        window.location.href = res.data.portal_url;
      }
    } catch (e) {
      console.error(e);
      alert("Billing portal is unavailable or you have not subscribed via Stripe yet.");
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleCheckout = async (plan: string) => {
    setCheckoutPlan(plan);
    try {
      const res = await fetchApi("/billing/checkout", { 
        method: "POST",
        body: JSON.stringify({ plan })
      });
      if (res.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to initiate checkout. Please try again later.");
    } finally {
      setCheckoutPlan(null);
    }
  };

  const isTrialing = subscription?.status === "trialing";
  const daysLeft = subscription?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(subscription.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
          <p className="mt-2 text-muted-foreground">Manage your subscription, view past invoices, and update payment methods.</p>
        </div>
        
        <button 
          onClick={handlePortal}
          disabled={isLoadingPortal}
          className="bg-card text-foreground border border-card-border px-4 py-2 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isLoadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Customer Portal
          <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
        </button>
      </div>

      {!isSubLoading && subscription && (
        <div className="glass rounded-2xl p-6 border border-card-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
              Current Plan: <span className="capitalize text-primary">{subscription.plan}</span>
              {subscription.status === 'active' && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">Active</span>
              )}
              {isTrialing && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500">Free Trial</span>
              )}
            </h2>
            {isTrialing && (
              <p className="text-sm text-muted-foreground mt-1">
                You have {daysLeft} days left in your free trial. Upgrade now to avoid interruption.
              </p>
            )}
            {subscription.status === 'active' && subscription.renews_at && (
              <p className="text-sm text-muted-foreground mt-1">
                Your subscription renews on {new Date(subscription.renews_at).toLocaleDateString()}.
              </p>
            )}
          </div>
          
          {isTrialing && (
            <button
              onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Upgrade Now
            </button>
          )}
        </div>
      )}

      {/* Pricing Plans */}
      <div id="pricing-plans" className="pt-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Starter Plan */}
          <div className="glass rounded-2xl border border-card-border p-8 flex flex-col relative overflow-hidden">
            {subscription?.plan === 'starter' && subscription?.status === 'active' && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                CURRENT PLAN
              </div>
            )}
            <h3 className="text-xl font-medium text-foreground mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">R$ 99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-grow">
              Perfect for new stores just getting started. Everything you need to sell online.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Up to 500 products
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Basic Analytics
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> 2 Staff Accounts
              </li>
            </ul>
            <button
              onClick={() => handleCheckout('starter')}
              disabled={checkoutPlan !== null || (subscription?.plan === 'starter' && subscription?.status === 'active')}
              className="w-full bg-white/5 border border-card-border text-foreground py-3 rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {checkoutPlan === 'starter' ? <Loader2 className="w-5 h-5 animate-spin" /> : (subscription?.plan === 'starter' && subscription?.status === 'active' ? 'Current Plan' : 'Subscribe to Starter')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass rounded-2xl border border-primary p-8 flex flex-col relative overflow-hidden bg-primary/5">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">R$ 299</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-grow">
              For growing businesses that need advanced features and scale.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited products
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Advanced Analytics & Reports
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited Staff Accounts
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Priority Support
              </li>
            </ul>
            <button
              onClick={() => handleCheckout('pro')}
              disabled={checkoutPlan !== null || (subscription?.plan === 'pro' && subscription?.status === 'active')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/25"
            >
              {checkoutPlan === 'pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : (subscription?.plan === 'pro' && subscription?.status === 'active' ? 'Current Plan' : 'Subscribe to Pro')}
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden mt-8">
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
              {isInvoicesLoading ? (
                // Skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <div className="h-8 bg-white/5 rounded animate-pulse w-8"></div>
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
