"use client";

import { Plus, MoreVertical, Mail, Shield, Loader2, X, Edit, Trash2 } from "lucide-react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { useState, useRef, useEffect } from "react";

const fetcher = (url: string) => fetchApi(url).then(res => res.data);

type UserData = {
  ulid: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function TeamPage() {
  const { data, isLoading, mutate } = useSWR("/users", fetcher);
  const { data: rolesData } = useSWR("/users/roles-matrix", fetcher);
  
  const team: UserData[] = data || [];
  const roles: string[] = rolesData ? Object.keys(rolesData) : ['ADMIN', 'MANAGER', 'CASHIER', 'STOCKIST', 'KITCHEN', 'DRIVER'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CASHIER'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'CASHIER' });
    setError(null);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleOpenEdit = (user: UserData) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setError(null);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (user: UserData) => {
    if (!confirm(`Are you sure you want to remove ${user.name} from the team?`)) return;
    
    setOpenDropdownId(null);
    try {
      await fetchApi(`/users/${user.ulid}`, { method: 'DELETE' });
      await mutate();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to delete user.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (modalMode === 'create') {
        await fetchApi('/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else if (editingUser) {
        // If editing and password is empty, don't send it
        const payload: Partial<typeof formData> = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        await fetchApi(`/users/${editingUser.ulid}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }
      
      await mutate();
      setIsModalOpen(false);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="mt-2 text-muted-foreground">Manage access and roles for your staff members.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden" ref={dropdownRef}>
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
                        {user.name.charAt(0).toUpperCase()}
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
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === user.ulid ? null : user.ulid)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openDropdownId === user.ulid && (
                      <div className="absolute right-6 top-12 w-48 bg-card border border-card-border rounded-xl shadow-xl overflow-hidden z-50 text-left">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="w-full px-4 py-2 text-sm text-foreground hover:bg-white/5 flex items-center gap-2 transition-colors"
                        >
                          <Edit className="w-4 h-4" /> Edit User
                        </button>
                        <button 
                          onClick={() => handleDelete(user)}
                          className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Remove User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-card-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-foreground">
                {modalMode === 'create' ? 'Invite Team Member' : 'Edit Team Member'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {modalMode === 'create' ? 'Temporary Password' : 'New Password (Optional)'}
                </label>
                <input 
                  type="password" 
                  required={modalMode === 'create'}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder={modalMode === 'create' ? "Minimum 8 characters" : "Leave blank to keep unchanged"}
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Invite' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
