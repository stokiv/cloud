"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForceLogin, setShowForceLogin] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      router.replace(callbackUrl || "/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // POST /auth/login is the endpoint defined in DashboardAuthController
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, force: showForceLogin }),
      });

      if (response.data && response.data.token) {
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        login(response.data.token, response.data.user, response.data.tenant, callbackUrl || undefined);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to log in.";
      
      if (errorMessage.includes("Sessão ativa")) {
        setError("Active session detected. You might have left a session open or cleared your browser data. Force sign in to end the previous session.");
        setShowForceLogin(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 glass rounded-2xl border border-card-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stokiv Cloud</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your tenant</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
              placeholder="admin@stokiv.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-muted-foreground" htmlFor="password">
                Password
              </label>
              <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline transition-all">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${showForceLogin ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : showForceLogin ? (
              "Force Sign In (End previous session)"
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
