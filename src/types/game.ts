export interface GeneratorType {
  id: string;
  name: string;
  type: string;
  cost: number;
  baseCost: number;
  production: number;
  owned: number;
  category: 'generators' | 'clickers' | 'boosters';
  description: string;
  unlocked: boolean;
  effect: {
    type: 'generate' | 'boost' | 'multiply_click' | 'automation_speed' | 'quantum_boost' | 'synergy_boost';
    value: number;
  };
}

export type UpgradeCategory = 'power' | 'automation' | 'quantum' | 'synergy';

export interface UpgradeType {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: UpgradeCategory;
  effect: {
    type: 'multiply_click' | 'automation_speed' | 'quantum_boost' | 'synergy_boost';
    value: number;
  };
  purchased: boolean;
  unlocked: boolean;
  requires?: string[];
  tier: number;
}