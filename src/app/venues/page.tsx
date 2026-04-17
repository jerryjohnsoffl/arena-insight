"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Activity, Users } from 'lucide-react';
import { stadiums } from '@/data/stadiums';
import { supabase } from '@/lib/supabase';

export default function VenueSelection() {
  const [selectedStadium, setSelectedStadium] = useState<string>(stadiums[0].id);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      let currentRole = localStorage.getItem('userRole');
      let currentName = localStorage.getItem('userName');

      // Check if we have a Supabase session (from Google OAuth)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        currentRole = 'attendee'; // default Google users to attendee
        currentName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Attendee';
        
        localStorage.setItem('userRole', currentRole);
        localStorage.setItem('userName', currentName);
      }

      if (!currentRole) {
        router.push('/');
      } else {
        setRole(currentRole);
        setUserName(currentName || (currentRole === 'host' ? 'Admin' : 'Attendee'));
      }
    };

    checkAuth();
  }, [router]);

  const handleContinue = () => {
    router.push(`/dashboard?venue=${selectedStadium}`);
  };

  if (!role) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 -z-10"></div>
      
      <main className="flex flex-col items-center max-w-md w-full gap-8">
        <div className="text-center w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-zinc-900 border border-zinc-800 shadow-xl">
            {role === 'host' ? <Activity className="text-indigo-400" size={32} /> : <Users className="text-blue-400" size={32} />}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Welcome, <span className="capitalize">{userName}</span>
          </h2>
          <p className="text-zinc-400 text-sm">Select the venue you are checking into today.</p>
        </div>

        <div className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={14} className="text-indigo-400" /> Choose Venue
            </label>
            <div className="relative">
              <select 
                value={selectedStadium}
                onChange={(e) => setSelectedStadium(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-4 outline-none focus:border-indigo-500 transition-colors appearance-none shadow-inner"
              >
                {stadiums.map((stadium) => (
                  <option key={stadium.id} value={stadium.id}>
                    {stadium.name} ({stadium.city})
                  </option>
                ))}
              </select>
              {/* Custom arrow for select */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* Display capacity of selected stadium dynamically */}
            <div className="mt-2 text-xs text-zinc-500 px-1">
              Max Capacity: <span className="text-zinc-300 font-bold">{stadiums.find(s => s.id === selectedStadium)?.capacity.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-4"
          >
            Enter Platform <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
