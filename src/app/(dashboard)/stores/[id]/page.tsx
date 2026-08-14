"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Store, Globe, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

const fetchStore = (url: string) => fetchApi(url).then(res => res.data);
const fetchSettings = (url: string) => fetchApi(url).then(res => res.data);

export default function StoreEditPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const { data: store, error: storeError, isLoading: loadingStore } = useSWR(`/stores/${storeId}`, fetchStore);
  const { data: settings, error: settingsError, isLoading: loadingSettings } = useSWR(`/stores/${storeId}/online-settings`, fetchSettings);

  const [activeTab, setActiveTab] = useState<"general" | "online" | "delivery">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    trade_name: "",
    store_code: "",
    email: "",
    phone: "",
    fiscal_cnpj: "",
    slug: "",
    online_enabled: false,
    shop_enabled: false,
    delivery_enabled: false,
    pickup_enabled: false,
    delivery_fee_cents: 0,
    min_order_cents: 0,
    delivery_time_minutes: 0,
    primary_color: "",
  });

  useEffect(() => {
    if (store && settings) {
      setFormData({
        name: store.name || "",
        trade_name: store.trade_name || "",
        store_code: store.store_code || "",
        email: store.email || "",
        phone: store.phone || "",
        fiscal_cnpj: store.fiscal_cnpj || "",
        slug: settings.slug || "",
        online_enabled: settings.online_enabled || false,
        shop_enabled: settings.shop_enabled || false,
        delivery_enabled: settings.delivery_enabled || false,
        pickup_enabled: settings.pickup_enabled || false,
        delivery_fee_cents: settings.delivery_fee_cents || 0,
        min_order_cents: settings.min_order_cents || 0,
        delivery_time_minutes: settings.delivery_time_minutes || 0,
        primary_color: settings.primary_color || "",
      });
    }
  }, [store, settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // 1. Update general store info
      await fetchApi(`/stores/${storeId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          trade_name: formData.trade_name,
          store_code: formData.store_code,
          email: formData.email,
          phone: formData.phone,
          fiscal_cnpj: formData.fiscal_cnpj,
        }),
      });

      // 2. Update online settings
      await fetchApi(`/stores/${storeId}/online-settings`, {
        method: "PUT",
        body: JSON.stringify({
          slug: formData.slug,
          online_enabled: formData.online_enabled,
          shop_enabled: formData.shop_enabled,
          delivery_enabled: formData.delivery_enabled,
          pickup_enabled: formData.pickup_enabled,
          delivery_fee_cents: parseInt(formData.delivery_fee_cents.toString()),
          min_order_cents: parseInt(formData.min_order_cents.toString()),
          delivery_time_minutes: parseInt(formData.delivery_time_minutes.toString()),
          primary_color: formData.primary_color,
        }),
      });

      setMessage({ type: 'success', text: 'Store updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update store.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingStore || loadingSettings) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (storeError || settingsError) {
    return <div className="text-red-400 p-8">Failed to load store data.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/stores" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Store</h1>
          <p className="text-sm text-muted-foreground">{store?.name}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Store className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'online' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Globe className="w-4 h-4" />
          Online & Shop
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'delivery' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Truck className="w-4 h-4" />
          Delivery
        </button>
      </div>

      <div className="glass rounded-xl p-8 space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Store Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trade Name</label>
                <input
                  type="text"
                  name="trade_name"
                  value={formData.trade_name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <input
                  type="text"
                  name="fiscal_cnpj"
                  value={formData.fiscal_cnpj}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Store Code (Internal)</label>
                <input
                  type="text"
                  name="store_code"
                  value={formData.store_code}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'online' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-semibold mb-4">Online & Shop</h2>
            
            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-muted-foreground">URL Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-card-border bg-white/5 text-muted-foreground text-sm">
                  stokiv.com/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-r-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-muted-foreground">Primary Color (Hex)</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color || "#000000"}
                  onChange={handleInputChange}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleInputChange}
                  className="bg-black/20 border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors uppercase w-32"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-card-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Online Enabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">Make your store visible online</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="online_enabled" checked={formData.online_enabled} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="border border-card-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Shop Enabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">Allow customers to place orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="shop_enabled" checked={formData.shop_enabled} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-semibold mb-4">Delivery & Pickup</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="border border-card-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Delivery Enabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">Offer delivery to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="delivery_enabled" checked={formData.delivery_enabled} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="border border-card-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Pickup Enabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">Allow order pickup at store</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="pickup_enabled" checked={formData.pickup_enabled} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Delivery Fee (Cents)</label>
                <input
                  type="number"
                  name="delivery_fee_cents"
                  value={formData.delivery_fee_cents}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground">e.g. 500 for R$5,00</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Minimum Order (Cents)</label>
                <input
                  type="number"
                  name="min_order_cents"
                  value={formData.min_order_cents}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Est. Time (Minutes)</label>
                <input
                  type="number"
                  name="delivery_time_minutes"
                  value={formData.delivery_time_minutes}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
