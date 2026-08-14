"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Store } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

const fetchTypes = (url: string) => fetchApi(url).then(res => res.data);

export default function NewStorePage() {
  const router = useRouter();

  const { data: storeTypes, isLoading: loadingTypes } = useSWR("/store-types", fetchTypes);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    trade_name: "",
    email: "",
    phone: "",
    fiscal_cnpj: "",
    store_type_id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.store_type_id) {
      setMessage({ type: 'error', text: 'Name and Store Type are required.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetchApi(`/stores`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          trade_name: formData.trade_name,
          email: formData.email,
          phone: formData.phone,
          fiscal_cnpj: formData.fiscal_cnpj,
          store_type_id: formData.store_type_id,
        }),
      });

      setMessage({ type: 'success', text: 'Store created successfully.' });
      
      // Redirect to the newly created store edit page
      setTimeout(() => {
        router.push(`/stores/${res.data.ulid}`);
      }, 1000);

    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create store.' });
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/stores" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Store</h1>
          <p className="text-sm text-muted-foreground">Create a new store identity.</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={isSaving || loadingTypes}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Create Store
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <div className="glass rounded-xl p-8 space-y-6">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            General Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Store Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="My Store"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Store Type *</label>
              <select
                name="store_type_id"
                value={formData.store_type_id}
                onChange={handleInputChange}
                disabled={loadingTypes}
                className="w-full bg-black/20 border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                required
              >
                <option value="">Select a type</option>
                {storeTypes?.map((type: { ulid: string; name: string }) => (
                  <option key={type.ulid} value={type.ulid}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Trade Name (Razão Social)</label>
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
      </div>
    </div>
  );
}
