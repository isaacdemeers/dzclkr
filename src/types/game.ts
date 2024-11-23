export interface GeneratorType {
  id: string;
  name: string;
  type: string;
  cost: number;
  baseCost: number;
  production: number;
  owned: number;
  category: 'generators' | 'boosters' | 'synergy';
  description: string;
  unlocked: boolean;
}

export type UpgradeCategory = 'power' | 'automation' | 'quantum' | 'synergy';

export interface UpgradeType {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: UpgradeCategory;
  effect: {
    type: 'multiply_click' | 'boost_production' | 'automation_speed' | 'quantum_boost' | 'synergy_boost';
    value: number;
    target?: string;
  };
  purchased: boolean;
  unlocked: boolean;
  requires?: string[];
  tier: number;
}