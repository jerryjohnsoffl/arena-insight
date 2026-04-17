"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, User } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock Authentication
    // If email contains 'admin', set role as 'host'. Otherwise, 'attendee'.
    const role = email.trim().toLowerCase().includes('admin') ? 'host' : 'attendee';

    // Store in localStorage for the unified dashboard to know the user's role
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', isLogin ? email.split('@')[0] : name.trim());

    // Continue to venue selection
    router.push('/venues');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 -z-10"></div>

      <main className="flex flex-col items-center max-w-sm w-full gap-8">
        <div className="flex flex-col text-center w-full min-h-[90px] justify-end">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Arena Insight
          </h1>
          <p className="text-zinc-400 mt-2 text-sm transition-all duration-300">
            {isLogin ? "Sign in to access your dashboard" : "Create an account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-md flex flex-col relative overflow-hidden transition-all duration-500">
          
          {/* Animated Name Field Container */}
          <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isLogin ? 'grid-rows-[0fr] opacity-0 -translate-y-4' : 'grid-rows-[1fr] opacity-100 translate-y-0'}`}>
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2 pb-6">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required={!isLogin}
                    disabled={isLogin}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6 relative z-10 transition-transform duration-500">
            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-8 relative z-10">
            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10"
          >
            {isLogin ? "Sign In" : "Sign Up"} <ArrowRight size={18} />
          </button>

          <div className="mt-6 text-center relative z-10">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
