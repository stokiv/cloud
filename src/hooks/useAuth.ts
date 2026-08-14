"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface Tenant {
  name: string;
  subscription_status: string;
  trial_ends_at: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    const storedTenant = localStorage.getItem("auth_tenant");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        if (storedTenant) setTenant(JSON.parse(storedTenant));
      } catch (e) {
        console.error("Failed to parse stored auth data", e);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, newTenant?: Tenant, callbackUrl?: string) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    if (newTenant) localStorage.setItem("auth_tenant", JSON.stringify(newTenant));
    
    setToken(newToken);
    setUser(newUser);
    if (newTenant) setTenant(newTenant);
    
    router.push(callbackUrl || "/dashboard");
  };

  const logout = async () => {
    if (token) {
      try {
        await fetchApi("/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("Failed to cleanly logout from server", e);
      }
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_tenant");
    setToken(null);
    setUser(null);
    setTenant(null);
    router.push("/login");
  };

  const isTrialing = tenant?.subscription_status === 'trialing';
  const isLocked = tenant?.subscription_status === 'locked' || tenant?.subscription_status === 'canceled';

  return {
    user,
    tenant,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token,
    isTrialing,
    isLocked,
  };
}
