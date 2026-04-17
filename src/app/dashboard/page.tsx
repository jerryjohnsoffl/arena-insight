"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StadiumMap } from '@/components/StadiumMap';
import { CrowdHeatmap } from '@/components/CrowdHeatmap';
import { supabase } from '@/lib/supabase';
import { useCrowdModel } from '@/hooks/useCrowdModel';
import { stadiums } from '@/data/stadiums';
import { 
  Navigation, Bell, Ticket, Coffee, ShoppingBag, Map, 
  UploadCloud, Activity, Database, Check, Camera, Users, AlertTriangle, MapPin,
  LogOut
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venue');
  const stadium = stadiums.find(s => s.id === venueId) || stadiums[0];

  const [role, setRole] = useState<string>('attendee');

  // Attendee state
  const [zones, setZones] = useState([
    { id: 'gate-a', name: 'Main Gate A', currentCrowd: 0, capacity: 1000, estimatedWaitMinutes: 0 },
    { id: 'gate-b', name: 'North Gate B', currentCrowd: 0, capacity: 1000, estimatedWaitMinutes: 0 },
    { id: 'gate-c', name: 'South Gate C', currentCrowd: 0, capacity: 800, estimatedWaitMinutes: 0 },
    { id: 'food-east', name: 'Food Court East', currentCrowd: 0, capacity: 400, estimatedWaitMinutes: 0 },
  ]);

  const PROCESSING_RATE: Record<string, number> = {
    'gate-a': 35,
    'gate-b': 30,
    'gate-c': 40,
    'food-east': 15,
  };

  // Host/Command Center state
  const { model, isInitializing, estimateCrowd } = useCrowdModel();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [zoneId, setZoneId] = useState<string>('gate-a');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/');
    } else {
      setRole(userRole);
    }
  }, [router]);

  useEffect(() => {
    const fetchLiveStats = async () => {
      const { data } = await supabase
        .from('crowd_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        setZones(prevZones => prevZones.map(zone => {
          const latestForZone = data.find(d => d.zone_id === zone.id);
          if (latestForZone) {
            const crowd = latestForZone.estimated_count;
            return { 
              ...zone, 
              currentCrowd: crowd,
              estimatedWaitMinutes: Math.ceil(crowd / PROCESSING_RATE[zone.id])
            };
          }
          return zone;
        }));
      }
    };
    
    fetchLiveStats();

    const channel = supabase
      .channel('public:crowd_metrics')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'crowd_metrics' }, (payload) => {
        const newData = payload.new;
        setZones(prev => prev.map(zone => {
          if (zone.id === newData.zone_id) {
            return {
              ...zone,
              currentCrowd: newData.estimated_count,
              estimatedWaitMinutes: Math.ceil(newData.estimated_count / PROCESSING_RATE[zone.id])
            };
          }
          return zone;
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gates = zones.filter(z => z.id.startsWith('gate-'));
  const worstGate = [...gates].sort((a, b) => b.estimatedWaitMinutes - a.estimatedWaitMinutes)[0];
  const bestGate = [...gates].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes)[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCount(null);
      setSaved(false);
    }
  };

  const runAnalysis = async () => {
    if (!imgRef.current) return;
    setLoading(true);
    try {
      const estimatedCount = await estimateCrowd(imgRef.current);
      setCount(estimatedCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveToSupabase = async () => {
    if (count === null) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('crowd_metrics')
        .insert([{
          zone_id: zoneId,
          estimated_count: count,
          timestamp: new Date().toISOString()
        }]);

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans pb-24 text-zinc-50">
      {/* Header */}
      <div className="bg-zinc-900 border-zinc-800 border-b border-zinc-800 p-6 sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border ${role === 'host' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-blue-500/100/20 text-blue-400 border-blue-500/30'}`}>
              {role === 'host' ? <Activity size={24} /> : <Ticket size={24} />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-50 flex items-center gap-2">
                {stadium.name} 
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium uppercase tracking-wider">
                  {role} View
                </span>
              </h1>
              <p className="text-zinc-400 text-sm">{stadium.city}, {stadium.state} • {stadium.capacity.toLocaleString()} cap</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center text-zinc-300 transition shrink-0">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-zinc-900"></span>
            </button>
            <button onClick={logout} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition shrink-0 group">
              <LogOut size={20} className="group-hover:text-rose-400 transition" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8 mt-4">
        
        {/* Host Upload Interface (Only for Host) */}
        {role === 'host' && (
          <div className="bg-zinc-900 border-zinc-800 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><Camera size={22} className="text-indigo-400" /> Command Center Feed</h2>
                <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1 md:flex-none">
                    <MapPin size={16} className="text-zinc-400 shrink-0" />
                    <select
                      value={zoneId}
                      onChange={(e) => { setZoneId(e.target.value); setCount(null); setSaved(false); }}
                      className="bg-transparent text-sm font-medium outline-none text-zinc-100 appearance-none py-1 w-full"
                    >
                      {zones.map(z => (
                        <option key={z.id} value={z.id} className="bg-zinc-900 border-zinc-800 text-zinc-50">{z.name}</option>
                      ))}
                    </select>
                  </div>
                  <label className="cursor-pointer text-sm font-bold px-4 py-3 border border-zinc-800 bg-zinc-800 hover:bg-white hover:text-zinc-50 text-zinc-300 rounded-xl transition shadow-sm whitespace-nowrap">
                    Upload Scan
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="aspect-[21/9] w-full bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-800 shadow-inner">
                {imageSrc ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageSrc} ref={imgRef} alt="Upload preview" className="w-full h-full object-cover" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                    <UploadCloud size={40} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Awaiting crowd visual upload</p>
                  </div>
                )}
              </div>

              <button
                onClick={runAnalysis}
                disabled={!imageSrc || isInitializing || loading}
                className={`py-3 w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${!imageSrc || isInitializing
                    ? "bg-zinc-950 text-zinc-500 cursor-not-allowed border border-zinc-800"
                    : "bg-white text-zinc-50 hover:bg-zinc-200 active:scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  }`}
              >
                {loading ? <><Activity size={18} className="animate-spin" /> Analyzing Image...</> : <><Activity size={18} /> Execute Crowd Analytics</>}
              </button>
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Users size={120} />
                </div>
                <span className="text-zinc-400 font-medium z-10 text-center text-sm uppercase tracking-widest">Est. Capacity<br />({zones.find(z => z.id === zoneId)?.name})</span>
                <div className="text-6xl font-black bg-gradient-to-tr from-white to-zinc-500 bg-clip-text text-transparent z-10 my-4">
                  {count !== null ? count : '—'}
                </div>
                {count !== null && count > 700 && (
                  <div className="mt-2 flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full text-xs font-bold z-10 border border-rose-500/20">
                    <AlertTriangle size={14} /> Bottleneck Detected
                  </div>
                )}
              </div>

              <button
                onClick={saveToSupabase}
                disabled={saving || saved || count === null}
                className={`mt-4 py-4 w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-all border
                  ${saved
                    ? "bg-emerald-500/100/10 text-emerald-400 border-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 text-zinc-50 border-transparent shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                  } ${count === null ? "opacity-50 cursor-not-allowed saturate-0" : ""}`}
              >
                {saved ? <><Check size={18} /> Data Synced</> : saving ? <><Database size={18} className="animate-bounce" /> Syncing...</> : <><Database size={18} /> Sync Network Metrics</>}
              </button>
            </div>
          </div>
        )}

        {/* Global Alert Notification */}
        {worstGate?.estimatedWaitMinutes > 15 ? (
          <div className="bg-blue-500/10 border border-blue-500/30  p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="mt-1 text-blue-400 animate-pulse bg-blue-500/100/20 p-2 rounded-xl"><Navigation size={20} /></div>
            <div>
              <h3 className="font-bold text-blue-100 text-lg">Live Traffic Alert</h3>
              <p className="text-blue-200/80 mt-1">
                {worstGate.name} is highly congested ({worstGate.estimatedWaitMinutes} min wait). 
                Taking {bestGate.name} will save you ~{worstGate.estimatedWaitMinutes - bestGate.estimatedWaitMinutes} minutes.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30  p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="mt-1 text-emerald-400 bg-emerald-500/100/20 p-2 rounded-xl"><Navigation size={20} /></div>
            <div>
              <h3 className="font-bold text-emerald-100 text-lg">All Clear</h3>
              <p className="text-emerald-200/80 mt-1">
                Current stadium zones are moving smoothly. Conditions are optimal.
              </p>
            </div>
          </div>
        )}

        {/* Core Visualization Layout: Map + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="col-span-1 lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col h-full">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Map size={20} className="text-zinc-400" /> Interactive Venue Map</h2>
            <div className="flex-1">
              <StadiumMap zones={zones} stadium={stadium} />
            </div>
          </section>

          <section className="col-span-1">
            <CrowdHeatmap zones={zones} />
          </section>
        </div>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition p-6 rounded-2xl border border-zinc-800 text-zinc-300 shadow-sm hover:shadow-md">
            <Coffee size={24} className="text-orange-400" />
            <span className="font-medium">Order Food</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition p-6 rounded-2xl border border-zinc-800 text-zinc-300 shadow-sm hover:shadow-md">
            <ShoppingBag size={24} className="text-fuchsia-400" />
            <span className="font-medium">Merch Store</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition p-6 rounded-2xl border border-zinc-800 text-zinc-300 shadow-sm hover:shadow-md">
            <Ticket size={24} className="text-emerald-400" />
            <span className="font-medium">My Tickets</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition p-6 rounded-2xl border border-zinc-800 text-zinc-300 shadow-sm hover:shadow-md">
            <Map size={24} className="text-blue-400" />
            <span className="font-medium">Find Seat</span>
          </button>
        </section>

      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 font-sans p-8 text-zinc-50 flex items-center justify-center">Loading Ecosystem...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
