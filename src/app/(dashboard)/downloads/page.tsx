"use client";

import { DownloadCloud, Apple, Monitor, Smartphone, TerminalSquare } from "lucide-react";
import Link from "next/link";

export default function DownloadsPage() {
  const downloads = [
    {
      id: "macos",
      title: "macOS (Apple Silicon)",
      description: "Optimized for M1/M2/M3 chips. Requires macOS 13.0 or later.",
      version: "v1.4.2",
      icon: Apple,
      link: "#",
    },
    {
      id: "windows",
      title: "Windows",
      description: "For Windows 10 and 11. x64 architecture.",
      version: "v1.4.2",
      icon: Monitor,
      link: "#",
    },
    {
      id: "android",
      title: "Android (APK)",
      description: "Direct APK download for POS terminals and Android devices.",
      version: "v1.4.2",
      icon: Smartphone,
      link: "#",
    },
    {
      id: "kds",
      title: "Kitchen Display (KDS)",
      description: "Specialized build for kitchen monitors and tablets.",
      version: "v1.2.0",
      icon: TerminalSquare,
      link: "#",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Downloads</h1>
        <p className="mt-2 text-muted-foreground">Download the Stokiv POS and Management apps for your devices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloads.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-card-border">
                    {item.version}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              {item.description}
            </p>
            
            <div className="mt-6">
              <Link 
                href={item.link}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
                Download App
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
