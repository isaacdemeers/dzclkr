import React from 'react';
import { Shield, Timer } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

interface StatsProps {
  pwr: number;
  pwrPerSecond: number;
  pwrPerClick: number;
}

export function Stats({ pwr, pwrPerSecond, pwrPerClick }: StatsProps) {
  return (
    <div className="flex justify-center gap-6 mt-4">
      <div className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur rounded-lg p-3 flex items-center gap-2">
        <Shield className="text-green-500" size={20} />
        <span className="font-mono">{formatNumber(pwr)} PWR</span>
      </div>
      <div className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur rounded-lg p-3 flex items-center gap-2">
        <Timer className="text-green-500" size={20} />
        <span className="font-mono">+{formatNumber(pwrPerSecond)}/s</span>
      </div>
      <div className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur rounded-lg p-3 flex items-center gap-2">
        <Shield className="text-green-500" size={20} />
        <span className="font-mono">+{formatNumber(pwrPerClick)}/click</span>
      </div>
    </div>
  );
}