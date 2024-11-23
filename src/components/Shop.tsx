import React, { useState } from 'react';
import { Shield, Cog, Radio, Cpu } from 'lucide-react';
import { GeneratorType, UpgradeType, UpgradeCategory } from '../types/game';

interface ShopProps {
  generators: GeneratorType[];
  upgrades: UpgradeType[];
  pwr: number;
  onPurchaseGenerator: (id: string) => void;
  onPurchaseUpgrade: (id: string) => void;
}

const CATEGORIES: { id: UpgradeCategory; name: string; icon: React.ElementType; color: string }[] = [
  { id: 'power', name: 'TACTICAL', icon: Shield, color: 'green-500' },
  { id: 'automation', name: 'LOGISTICS', icon: Cog, color: 'amber-500' },
  { id: 'quantum', name: 'INTEL', icon: Radio, color: 'blue-500' },
  { id: 'synergy', name: 'COMMAND', icon: Cpu, color: 'red-500' },
];

export function Shop({ upgrades, pwr, onPurchaseUpgrade }: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<UpgradeCategory>('power');

  return (
    <div className="h-full flex flex-col bg-zinc-800/30 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
      {/* Categories */}
      <div className="flex p-2 h-full gap-2 bg-zinc-800/50 rounded-t-lg border-b border-zinc-700/50">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded font-bold tracking-wider text-sm transition-all
              ${selectedCategory === category.id
                ? `bg-${category.color} text-zinc-900 shadow-lg shadow-${category.color}/20`
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/80'
              }`}
          >
            <category.icon size={16} />
            {category.name}
          </button>
        ))}
      </div>

      {/* Upgrades */}
      <div className="flex-1 h-full p-4 overflow-y-auto space-y-3">
        {upgrades
          .filter(u => u.unlocked && !u.purchased && u.category === selectedCategory)
          .sort((a, b) => a.cost - b.cost)
          .map(upgrade => (
            <div key={upgrade.id}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-900/80 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold tracking-wider">{upgrade.name}</h3>
                <span className={`text-${CATEGORIES.find(c => c.id === upgrade.category)?.color} font-mono`}>
                  {formatNumber(upgrade.cost)} PWR
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-3">{upgrade.description}</p>
              <button
                onClick={() => onPurchaseUpgrade(upgrade.id)}
                disabled={pwr < upgrade.cost}
                className={`w-full py-2 rounded font-bold tracking-wider transition-all
                  ${pwr >= upgrade.cost
                    ? `bg-${CATEGORIES.find(c => c.id === upgrade.category)?.color} 
                       text-zinc-900 
                       hover:brightness-110 
                       shadow-lg 
                       shadow-${CATEGORIES.find(c => c.id === upgrade.category)?.color}/20`
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
              >
                DEPLOY
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}