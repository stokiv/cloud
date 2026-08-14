"use client";

import { User, Lock, Smartphone, ShieldCheck, Loader2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetchApi(url).then((res) => res.data);

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: tenantSettings, isLoading, mutate } = useSWR("/tenant/settings", fetcher);
  const [activeTab, setActiveTab] = useState("personal");

  // Loading & Toast State
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Personal Info State
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Connected Apps State
  const [mpAccessToken, setMpAccessToken] = useState("");
  const [mpPublicKey, setMpPublicKey] = useState("");
  const [efiClientId, setEfiClientId] = useState("");
  const [efiClientSecret, setEfiClientSecret] = useState("");
  const [efiPixKey, setEfiPixKey] = useState("");

  // Populate state when settings load
  useEffect(() => {
    if (tenantSettings) {
      setDefaultCurrency(tenantSettings.default_currency || "BRL");
      setCommissionRate(tenantSettings.commission_rate?.toString() || "0");
    }
  }, [tenantSettings]);

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    try {
      await fetchApi("/tenant/settings", {
        method: "PUT",
        body: JSON.stringify({
          default_currency: defaultCurrency,
          commission_rate: parseFloat(commissionRate)
        }),
      });
      await mutate();
      showToast("Personal info saved successfully.", "success");
    } catch (e: unknown) {
      const error = e as Error;
      showToast(error.message || "Failed to save personal info.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setIsSaving(true);
    try {
      await fetchApi("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      showToast("Password updated successfully.", "success");
    } catch (e: unknown) {
      const error = e as Error;
      showToast(error.message || "Failed to update password.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveIntegrations = async () => {
    setIsSaving(true);
    
    // Only send fields that have been typed into (to avoid overwriting with empty strings if they just didn't want to change it)
    // The backend handles '******' masks and ignores them.
    const body: Record<string, string> = {};
    if (mpAccessToken) body.mp_access_token = mpAccessToken;
    if (mpPublicKey) body.mp_public_key = mpPublicKey;
    if (efiClientId) body.efi_client_id = efiClientId;
    if (efiClientSecret) body.efi_client_secret = efiClientSecret;
    if (efiPixKey) body.efi_pix_key = efiPixKey;

    try {
      await fetchApi("/tenant/settings", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      await mutate();
      showToast("Integrations saved successfully.", "success");
      
      // Clear sensitive inputs after save
      setMpAccessToken("");
      setMpPublicKey("");
      setEfiClientId("");
      setEfiClientSecret("");
      setEfiPixKey("");
    } catch (e: unknown) {
      const error = e as Error;
      showToast(error.message || "Failed to save integrations.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

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
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                          className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Base Commission Rate (%)</label>
                        <input 
                          type="number" 
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(e.target.value)}
                          className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleSavePersonalInfo}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                      Save Changes
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
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isSaving || !currentPassword || newPassword.length < 8}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 mt-4"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                    Update Password
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${tenantSettings?.has_mp_credentials ? 'bg-green-500' : 'bg-red-500'}`} />
                          <p className="text-xs text-muted-foreground">{tenantSettings?.has_mp_credentials ? 'Connected' : 'Not Connected'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Access Token</label>
                        <input 
                          type="password"
                          value={mpAccessToken}
                          onChange={(e) => setMpAccessToken(e.target.value)}
                          placeholder={tenantSettings?.has_mp_credentials ? "••••••••••••••••••••••••••••••••" : "APP_USR-..."}
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Public Key</label>
                        <input 
                          type="text"
                          value={mpPublicKey}
                          onChange={(e) => setMpPublicKey(e.target.value)}
                          placeholder={tenantSettings?.has_mp_credentials ? "••••••••••••••••" : "APP_USR-..."}
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${tenantSettings?.has_efi_credentials ? 'bg-green-500' : 'bg-red-500'}`} />
                          <p className="text-xs text-muted-foreground">{tenantSettings?.has_efi_credentials ? 'Connected' : 'Not Connected'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Client ID</label>
                        <input 
                          type="text"
                          value={efiClientId}
                          onChange={(e) => setEfiClientId(e.target.value)}
                          placeholder={tenantSettings?.has_efi_credentials ? "••••••••••••••••" : "Client ID..."}
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Client Secret</label>
                        <input 
                          type="password"
                          value={efiClientSecret}
                          onChange={(e) => setEfiClientSecret(e.target.value)}
                          placeholder={tenantSettings?.has_efi_credentials ? "••••••••••••••••••••••••••••••••" : "Client Secret..."}
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Pix Key</label>
                        <input 
                          type="text"
                          value={efiPixKey}
                          onChange={(e) => setEfiPixKey(e.target.value)}
                          placeholder={tenantSettings?.efi_pix_key ? "••••••••••••" : "CNPJ, CPF, Email, ou Chave Aleatória"}
                          className="w-full bg-background border border-card-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-card-border">
                    <button 
                      onClick={handleSaveIntegrations}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                      Save Integrations
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
