"use client";

import { Store, Globe, ShoppingBag, Settings, MoreVertical, Loader2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

interface StoreData {
  ulid: string;
  name: string;
  trade_name: string | null;
  store_code: string | null;
  is_active: boolean;
  fiscal_cnpj: string | null;
  store_type?: {
    name: string;
  };
}

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

export default function StoresPage() {
  const { data, error, isLoading } = useSWR("/stores", fetcher);

  // Laravel pagination typically returns data in `data.data` or `data` directly depending on the resource
  // StoreController index returns: successResponse(StoreResource::collection($stores))
  // The ApiResponser returns { data: ... }
  // StoreResource::collection usually returns { data: [...] } inside it, so it might be data.data
  const stores: StoreData[] = data?.data || data || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Stores</h1>
          <p className="mt-2 text-muted-foreground">Manage your store identities and online presence.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Store className="w-4 h-4" />
          Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading && (
          <div className="glass rounded-xl p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && error && (
          <div className="glass rounded-xl p-12 flex items-center justify-center text-red-400">
            Failed to load stores.
          </div>
        )}

        {!isLoading && !error && stores.length === 0 && (
          <div className="glass rounded-xl p-12 flex items-center justify-center text-muted-foreground">
            No stores found.
          </div>
        )}

        {!isLoading && stores.map((store) => (
          <div key={store.ulid} className="glass rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${store.is_active ? 'bg-primary/10 text-primary' : 'bg-card-border text-muted-foreground'}`}>
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {store.name}
                  {store.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-card-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  {store.store_code && (
                    <span className="text-sm text-primary flex items-center gap-1">
                      Code: {store.store_code}
                    </span>
                  )}
                  {store.store_code && <span className="hidden sm:inline text-card-border">•</span>}
                  <p className="text-sm text-muted-foreground">
                    {store.fiscal_cnpj ? `CNPJ: ${store.fiscal_cnpj}` : 'No CNPJ configured'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-card-border pt-4 sm:pt-0">
              <div className={`flex gap-4 ${store.is_active ? '' : 'opacity-40'}`}>
                <div className="flex flex-col items-center">
                  <Globe className={`w-5 h-5 mb-1 ${store.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShoppingBag className={`w-5 h-5 mb-1 ${store.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground">Shop</span>
                </div>
              </div>
              
              <div className="h-8 w-px bg-card-border hidden sm:block"></div>

              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
