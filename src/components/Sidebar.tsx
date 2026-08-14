"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  Store, 
  MonitorSmartphone, 
  RefreshCw,
  Users,
  Settings,
  DownloadCloud
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Stores", href: "/stores", icon: Store },
  { name: "Devices", href: "/devices", icon: MonitorSmartphone },
  { name: "Sync Status", href: "/sync", icon: RefreshCw },
  { name: "Team", href: "/team", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard }, // Or a different icon
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Downloads", href: "/downloads", icon: DownloadCloud },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex flex-col flex-grow bg-card border-r border-card-border overflow-y-auto">
        <div className="flex items-center h-16 flex-shrink-0 px-6">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Stokiv <span className="text-primary">Cloud</span>
          </span>
        </div>
        <div className="flex-1 flex flex-col px-4 mt-6">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-card-border">
          <div className="flex items-center px-3 py-2 rounded-lg bg-white/5">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              L
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">Lucas</p>
              <p className="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
