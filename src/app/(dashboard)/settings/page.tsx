"use client";

import { User, Lock, Smartphone, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-2 transition-colors">
            <Lock className="w-4 h-4" /> Security
          </button>
          <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-2 transition-colors">
            <Smartphone className="w-4 h-4" /> Connected Apps
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Lucas"
                    className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="Silva"
                    className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="lucas@ferramentassilva.com.br"
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground opacity-70"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Two-Factor Authentication</h2>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500 shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">2FA is currently enabled</p>
                <p className="text-sm text-muted-foreground mt-1">Your account is protected by two-factor authentication using an authenticator app.</p>
                <button className="mt-4 bg-card border border-card-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-card/80 transition-colors">
                  Manage 2FA Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
