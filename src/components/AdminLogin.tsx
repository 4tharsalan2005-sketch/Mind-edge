import React, { useState } from 'react';
import { adminLogin } from '../services/api.ts';
import { Lock, User, KeyRound, ArrowLeft, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (userData: { username: string; displayName: string }) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('mindedge2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await adminLogin(username, password);
      // Save session in localStorage for seamless reloading
      localStorage.setItem('mindedge_admin_token', data.token);
      localStorage.setItem('mindedge_admin_user', JSON.stringify(data.user));
      onSuccess(data.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your login details.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setUsername('admin');
    setPassword('mindedge2026');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with vibrant indigo-to-purple gradient */}
        <div className="p-8 pb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Role Portal</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Admin Authentication</h2>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Secure curriculum access to configure database constraints, syllabus limits, and dynamic quizzes.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 pt-6">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Helper Autofill Box */}
            <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div className="text-indigo-900">
                <span className="font-bold">Default Credentials:</span>
                <span className="text-indigo-700 block font-mono text-[11px]">admin / mindedge2026</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Auto-Fill</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Mind Edge Security Layer · Session Access Restricted
        </div>
      </div>
    </div>
  );
};
