'use client';

import React from 'react';
import { Shield, Gauge, Zap, Target } from 'lucide-react';
import { Shop } from './components/Shop';
import { useGame } from './hooks/useGame';

export default function Home() {
  const {
    pwr,
    pwrPerClick,
    pwrPerSecond,
    generators,
    upgrades,
    handleClick,
    purchaseGenerator,
    purchaseUpgrade,
    progress,
  } = useGame();

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <header className="bg-black/50 border-b border-[#FFA944]/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFA944]/20 rounded-lg blur-md"></div>
                <Shield className="w-6 h-6 text-[#FFA944] relative" />
              </div>
              <div>
                <div className="text-xs text-[#FFA944] font-mono tracking-wider">TACTICAL SYSTEMS</div>
                <div className="text-lg font-bold tracking-tight">Power Command</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-zinc-500 font-mono">
                <Target className="w-4 h-4" />
                SECTOR-DEADZONE
              </div>
              <div className="flex items-center gap-1 text-[#FFA944] font-mono">
                <Zap className="w-4 h-4" />
                ACTIVE
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex flex-col gap-4 min-h-0 my-40">
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex-none border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-4">
              <div className="font-mono text-sm text-[#FFA944] mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                SYSTEM METRICS
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {pwr.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#FFA944] font-mono tracking-wider">TOTAL PWR</div>
                </div>
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {pwrPerSecond.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#FFA944] font-mono tracking-wider">PWR/SEC</div>
                </div>
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {pwrPerClick.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#FFA944] font-mono tracking-wider">PWR/CLICK</div>
                </div>
              </div>
            </div>

            <div className="flex-1 border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-8 flex items-center justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#FFA944]/10 rounded-full blur-3xl group-hover:bg-[#FFA944]/20 transition-all duration-300"></div>
                <button
                  onClick={handleClick}
                  className="relative w-64 h-64 rounded-full bg-black border-8 border-[#FFA944]/50 flex items-center justify-center transform hover:scale-105 transition-all duration-100 active:scale-95 shadow-lg shadow-[#FFA944]/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FFA944]/5 to-transparent rounded-full"></div>
                  <div className="absolute inset-8 border-8 border-dashed border-[#FFA944]/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,169,68,0.1),transparent)]"></div>

                  <div className="absolute inset-0 animate-ping-slow opacity-20">
                    <div className="absolute inset-12 border-2 border-[#FFA944] rounded-full"></div>
                    <div className="absolute inset-16 border-2 border-[#FFA944] rounded-full"></div>
                    <div className="absolute inset-20 border-2 border-[#FFA944] rounded-full"></div>
                  </div>

                  <div className="relative flex flex-col items-center gap-2">
                    <div className="text-[#FFA944] text-2xl font-mono tracking-wider">GENERATE</div>
                    <div className="text-white font-bold text-4xl">POWER</div>
                    <div className="text-[#FFA944]/70 text-sm font-mono mt-2">
                      +{pwrPerClick.toFixed(1)} PWR
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-4 min-w-0 overflow-hidden">
            <Shop
              generators={generators}
              upgrades={upgrades}
              pwr={pwr}
              onPurchaseGenerator={purchaseGenerator}
              onPurchaseUpgrade={purchaseUpgrade}
            />
          </div>
        </div>

        <div className="flex-none border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-sm" style={{ color: progress.color }}>
              SYSTEM LEVEL {progress.level}
            </div>
            <div className="font-mono text-xs text-zinc-500">
              {progress.progress.toFixed(1)}%
            </div>
          </div>

          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-150 ease-out"
              style={{
                width: `${progress.progressPercentage}%`,
                backgroundColor: progress.color,
                boxShadow: `0 0 10px ${progress.color}`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-center items-center">
            <div className="text-xs font-mono text-zinc-400">
              PROGRESS TO NEXT LEVEL: {(100 - progress.progress).toFixed(1)}%
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}