import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Clock, AlertTriangle } from "lucide-react";

export default function TrialBanner() {
  const { tenant, isTrialing, isLocked } = useAuth();

  if (!isTrialing && !isLocked) {
    return null;
  }

  if (isLocked) {
    return (
      <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-4 py-3 text-sm flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-medium">Sua conta está bloqueada ou inativa.</span>
        <Link href="/billing" className="underline font-semibold hover:text-red-400">
          Reative sua assinatura
        </Link>
      </div>
    );
  }

  // Calculate days remaining
  let daysRemaining = 0;
  if (tenant?.trial_ends_at) {
    const trialEnd = new Date(tenant.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20 text-primary px-4 py-3 text-sm flex items-center justify-center gap-2">
      <Clock className="w-4 h-4" />
      <span>
        Você está no período de teste gratuito. <span className="font-bold">{daysRemaining} dias restantes.</span>
      </span>
      <Link href="/billing" className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold hover:bg-primary/90 ml-2 transition-colors">
        Assinar Agora
      </Link>
    </div>
  );
}
