"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Video, Loader } from 'lucide-react';

interface LiveCameraProps {
  onFrame: (videoElement: HTMLVideoElement) => Promise<number>;
  onCountUpdate: (count: number, zoneId: string) => void;
  zoneId: string;
  zoneName: string;
  isModelReady: boolean;
  isActiveMatch: boolean;
}

export function LiveCamera({ onFrame, onCountUpdate, zoneId, zoneName, isModelReady, isActiveMatch }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestCount, setLatestCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const analyzeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameCountRef = useRef(0);
  const fpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }
    if (fpsIntervalRef.current) {
      clearInterval(fpsIntervalRef.current);
      fpsIntervalRef.current = null;
    }
    setIsStreaming(false);
    setIsAnalyzing(false);
    setLatestCount(null);
    setFps(0);
    frameCountRef.current = 0;
  }, []);

  const startAutoAnalysis = useCallback(() => {
    if (!isModelReady || !videoRef.current || analyzeIntervalRef.current) return;
    
    setIsAnalyzing(true);
    
    // Track FPS
    fpsIntervalRef.current = setInterval(() => {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
    }, 1000);

    // Run inference every 4 seconds
    analyzeIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const count = await onFrame(videoRef.current);
        frameCountRef.current++;
        setLatestCount(count);
        onCountUpdate(count, zoneId);
      } catch (err) {
        console.error('Frame analysis error:', err);
      }
    }, 4000);
  }, [isModelReady, onFrame, onCountUpdate, zoneId]);

  const stopAutoAnalysis = useCallback(() => {
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }
    if (fpsIntervalRef.current) {
      clearInterval(fpsIntervalRef.current);
      fpsIntervalRef.current = null;
    }
    setIsAnalyzing(false);
    setFps(0);
    frameCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Live Video Feed */}
      <div className="aspect-video w-full bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-800 shadow-inner">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
            <Video size={40} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Click &quot;Start Camera&quot; for live crowd feed</p>
          </div>
        )}

        {/* Live indicator overlay */}
        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
            {isAnalyzing && (
              <div className="flex items-center gap-1.5 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Loader size={10} className="animate-spin" />
                ML Active
              </div>
            )}
            {isActiveMatch && (
              <div className="flex items-center gap-1.5 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                EVENT
              </div>
            )}
          </div>
        )}

        {/* Real-time count overlay */}
        {isAnalyzing && latestCount !== null && (
          <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-sm border border-zinc-700 text-white rounded-xl px-4 py-2 flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{zoneName}</span>
            <span className="text-2xl font-black">{latestCount}</span>
            <span className="text-[10px] text-zinc-500">people detected</span>
          </div>
        )}
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
          {error}
        </div>
      )}

      {/* Camera Control Buttons */}
      <div className="flex gap-3">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Camera size={18} /> Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={stopCamera}
              className="py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white transition-all active:scale-[0.98]"
            >
              <CameraOff size={18} /> Stop
            </button>
            
            {!isAnalyzing ? (
              <button
                onClick={startAutoAnalysis}
                disabled={!isModelReady}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                  ${!isModelReady 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                    : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}
              >
                {!isModelReady 
                  ? <><Loader size={18} className="animate-spin" /> Loading Model...</>
                  : <><Camera size={18} /> Start Auto-Analysis</>
                }
              </button>
            ) : (
              <button
                onClick={stopAutoAnalysis}
                className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white transition-all active:scale-[0.98]"
              >
                <CameraOff size={18} /> Stop Analysis
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
