"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Settings, AlertCircle } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

interface NotificationMeta {
  icon: string;
  label: string;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  meta: NotificationMeta;
}

interface NotificationsResponse {
  data: NotificationItem[];
  unread_count: number;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: res, mutate } = useSWR<NotificationsResponse>("/notifications", fetchApi);
  
  const notifications = res?.data || [];
  const unreadCount = res?.unread_count || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetchApi("/notifications/read-all", { method: "POST" });
      mutate();
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PATCH" });
      mutate();
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors relative"
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-card-border rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 py-3 border-b border-card-border/50 flex justify-between items-center bg-card">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[24rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center flex flex-col items-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-card-border/50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read_at ? 'bg-primary/5' : ''}`}
                    onClick={() => !notification.read_at && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl flex-shrink-0 mt-1">
                        {notification.meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-2">
                          {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notification.read_at && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-card-border bg-card/50">
            <button 
              className="w-full text-center px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-3 h-3" />
              Notification Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
