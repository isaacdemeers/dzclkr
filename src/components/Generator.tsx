import React from 'react';
import { Battery, Cpu, CircuitBoard, Zap } from 'lucide-react';
import { GeneratorType } from '../hooks/useGame';

const ICONS = {
  basic: Battery,
  advanced: Cpu,
  quantum: CircuitBoard,
};

interface GeneratorProps {
  generator: GeneratorType;
  canAfford: boolean;
  onPurchase: (id: string) => void;
}

export function Generator({ generator, canAfford, onPurchase }: GeneratorProps) {
  const Icon = ICONS[generator.type as keyof typeof ICONS] || Zap;

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg hover:shadow-yellow-500/10 transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-yellow-400" />
        <h3 className="text-lg font-semibold">{generator.name}</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-slate-300">Production: {generator.production} PWR/s</p>
        <p className="text-slate-300">Owned: {generator.owned}</p>
        <button
          onClick={() => onPurchase(generator.id)}
          disabled={!canAfford}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            canAfford
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Buy for {generator.cost} PWR
        </button>
      </div>
    </div>
  );
}