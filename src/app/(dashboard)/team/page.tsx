"use client";

import { Plus, MoreVertical, Mail, Shield, Loader2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

type UserData = {
  ulid: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function TeamPage() {
  const { data, isLoading } = useSWR("/users", fetcher);
  const team: UserData[] = data || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="mt-2 text-muted-foreground">Manage access and roles for your staff members.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-white/5">
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Member</th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && team.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No team members found.
                  </td>
                </tr>
              )}
              {team.map((user) => (
                <tr key={user.ulid} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
