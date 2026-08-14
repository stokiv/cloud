"use client";

import { User, Lock, Smartphone, ShieldCheck, Loader2, Save } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const fetcher = (url: string) => fetchApi(url).then((res) => res.data);

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: tenantSettings, isLoading } = useSWR("/tenant/settings", fetcher);
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab("personal")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === "personal" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === "security" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <Lock className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab("apps")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === "apps" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Connected Apps
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          {/* PERSONAL INFO TAB */}
          {activeTab === "personal" && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.name || ""}
                        className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground opacity-70"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                      <input 
                        type="text" 
                        defaultValue={user?.role || "Owner"}
                        className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground opacity-70"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ""}
                      className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground opacity-70"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address.</p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-card-border">
                    <h3 className="text-lg font-medium text-foreground mb-4">Store Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Default Currency</label>
                        <input 
                          type="text" 
                          defaultValue={tenantSettings?.default_currency || "BRL"}
                          className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Base Commission Rate (%)</label>
                        <input 
                          type="number" 
                          defaultValue={tenantSettings?.commission_rate || "0"}
                          className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button 
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Two-Factor Authentication</h2>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500 shrink-0 mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">2FA is currently enabled</p>
                  <p className="text-sm text-muted-foreground mt-1">Your account is protected by two-factor authentication using an authenticator app.</p>
                  <button className="mt-4 bg-card border border-card-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                    Manage 2FA Settings
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-card-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 mt-4">
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONNECTED APPS TAB */}
          {activeTab === "apps" && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Connected Apps & Integrations</h2>
              <p className="text-muted-foreground text-sm mb-8">Manage API keys and external integrations for your Stokiv store.</p>

              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-8">
                  
                  <div className="border border-card-border rounded-xl p-5 bg-black/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center font-bold">
                        MP
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Mercado Pago</h3>
                        <p className="text-xs text-muted-foreground">Payment Gateway</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Access Token</label>
                        <input 
                          type="password"
                          placeholder="APP_USR-..."
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Public Key</label>
                        <input 
                          type="text"
                          placeholder="APP_USR-..."
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-card-border rounded-xl p-5 bg-black/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-orange-500/20 text-orange-500 rounded-lg flex items-center justify-center font-bold">
                        EF
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">EFI (Gerencianet)</h3>
                        <p className="text-xs text-muted-foreground">Pix & Boleto</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Client ID</label>
                        <input 
                          type="text"
                          placeholder="Client ID..."
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Client Secret</label>
                        <input 
                          type="password"
                          placeholder="Client Secret..."
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Pix Key</label>
                        <input 
                          type="text"
                          placeholder="CNPJ, CPF, Email, ou Chave Aleatória"
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-card-border">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Integrations
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
