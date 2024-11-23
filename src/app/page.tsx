'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Gauge, Zap, Target } from 'lucide-react';
import { Shop } from './components/Shop';
import { useGame } from './hooks/useGame';
import { formatNumber } from '@/app/utils/formatNumber';
import { PlayerCard } from './components/PlayerCard';

export default function Home() {
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const [isQuitting, setIsQuitting] = useState(false);

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
    powerBoostActive,
    togglePowerBoost,
    resetGame,
  } = useGame();

  useEffect(() => {
    if (progress.level >= 100 && !showEndPopup) {
      setShowEndPopup(true);
    }
  }, [progress.level]);

  return (
    <div className={`h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden transition-opacity duration-1000 ${isQuitting ? 'opacity-0' : 'opacity-100'}`}>
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
              <label className="flex items-center gap-2 cursor-pointer bg-black/50 px-3 py-1.5 rounded-lg border border-[#FFA944]/20">
                <input
                  type="checkbox"
                  checked={powerBoostActive}
                  onChange={togglePowerBoost}
                  className="w-3 h-3 accent-[#FFA944] bg-black/50 border border-[#FFA944]/30 rounded"
                />
                <span className="text-xs font-mono text-[#FFA944]">BOOST MODE</span>
              </label>
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

      <main className="flex items-center gap-4 justify-center flex-col m-[100px] h-full rounded-3xl border border-[#FFA944]/10 bg-black/30 backdrop-blur-sm p-4">
        <PlayerCard
          level={progress.level >= 100 ? 'MAX' : progress.level}
          progress={progress.progress}
          requiredExp={progress.requiredExp}
          
        />

        <div className="flex gap-4 items-center justify-center  w-full h-full">
          <div className="flex h-full w-1/2  flex-col gap-4 ">
            <div className="flex w-full flex-col border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-4">
              <div className="font-mono text-sm text-[#FFA944] mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                SYSTEM METRICS
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {formatNumber(pwr)}
                  </div>
                  <div className="text-xs text-[#FFA944] font-mono tracking-wider">TOTAL PWR</div>
                </div>
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {formatNumber(pwrPerSecond)}
                  </div>
                  <div className="text-xs text-[#FFA944] font-mono tracking-wider">PWR/SEC</div>
                </div>
                <div className="bg-black/50 border border-[#FFA944]/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white mb-1 font-sans">
                    {formatNumber(pwrPerClick)}
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
                      +{powerBoostActive ? '100' : formatNumber(pwrPerClick)} PWR
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-1/2 h-full border border-[#FFA944]/10 rounded-lg bg-black/30 backdrop-blur-sm p-4 min-w-0 overflow-scroll w-[500px]">
            <Shop
              generators={generators}
              upgrades={upgrades}
              pwr={pwr}
              onPurchaseGenerator={purchaseGenerator}
              onPurchaseUpgrade={purchaseUpgrade}
            />
          </div>
        </div>
      </main>

      {showEndPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border border-[#FFA944]/20 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Shield className="w-16 h-16 text-[#FFA944] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#FFA944] mb-4">You reached the maximum level</h2>
              <button
                onClick={() => {
                  setShowEndPopup(false);
                  setShowQuitPopup(true);
                }}
                className="px-6 py-3 bg-[#FFA944]/10 border border-[#FFA944]/20 rounded-lg text-[#FFA944] hover:bg-[#FFA944]/20 transition-all duration-200"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuitPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border border-[#FFA944]/20 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#FFA944] mb-8">QUIT THE SIMULATION?</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    resetGame();
                    setShowQuitPopup(false);
                  }}
                  className="px-6 py-3 bg-[#FFA944]/10 border border-[#FFA944]/20 rounded-lg text-[#FFA944] hover:bg-[#FFA944]/20 transition-all duration-200"
                >
                  RESTART
                </button>
                <button
                  onClick={() => {
                    setIsQuitting(true);
                  }}
                  className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-all duration-200"
                >
                  QUIT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}