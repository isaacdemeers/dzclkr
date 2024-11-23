import { useState, useEffect, useCallback } from 'react';
import { GeneratorType, UpgradeType } from '../types/game';

const INITIAL_GENERATORS: GeneratorType[] = [
  {
    id: 'gen1',
    name: 'Basic Generator',
    type: 'basic',
    cost: 10,
    baseCost: 10,
    production: 0.1,
    owned: 0,
    category: 'generators',
    description: 'A simple PWR generator',
    unlocked: true,
  },
  {
    id: 'gen2',
    name: 'Advanced Generator',
    type: 'advanced',
    cost: 50,
    baseCost: 50,
    production: 0.5,
    owned: 0,
    category: 'generators',
    description: 'More efficient PWR generation',
    unlocked: true,
  },
  {
    id: 'boost1',
    name: 'PWR Amplifier',
    type: 'quantum',
    cost: 100,
    baseCost: 100,
    production: 0.2,
    owned: 0,
    category: 'boosters',
    description: 'Boosts all generators by 10%',
    unlocked: false,
  },
];

const INITIAL_UPGRADES: UpgradeType[] = [
  // Power Upgrades
  {
    id: 'power1',
    name: 'Enhanced Click',
    description: 'Double click power',
    cost: 50,
    category: 'power',
    effect: { type: 'multiply_click', value: 2 },
    purchased: false,
    unlocked: true,
    tier: 1
  },
  {
    id: 'power2',
    name: 'Power Surge',
    description: 'Triple click power',
    cost: 200,
    category: 'power',
    effect: { type: 'multiply_click', value: 3 },
    purchased: false,
    unlocked: true,
    tier: 2
  },
  {
    id: 'power3',
    name: 'Energy Burst',
    description: '5x click power',
    cost: 1000,
    category: 'power',
    effect: { type: 'multiply_click', value: 5 },
    purchased: false,
    unlocked: true,
    tier: 3
  },
  {
    id: 'power4',
    name: 'Power Overload',
    description: '10x click power',
    cost: 5000,
    category: 'power',
    effect: { type: 'multiply_click', value: 10 },
    purchased: false,
    unlocked: true,
    tier: 4
  },
  {
    id: 'power5',
    name: 'Energy Matrix',
    description: '25x click power',
    cost: 25000,
    category: 'power',
    effect: { type: 'multiply_click', value: 25 },
    purchased: false,
    unlocked: true,
    tier: 5
  },
  {
    id: 'power6',
    name: 'Power Singularity',
    description: '50x click power',
    cost: 100000,
    category: 'power',
    effect: { type: 'multiply_click', value: 50 },
    purchased: false,
    unlocked: true,
    tier: 6
  },
  {
    id: 'power7',
    name: 'Energy Nova',
    description: '100x click power',
    cost: 500000,
    category: 'power',
    effect: { type: 'multiply_click', value: 100 },
    purchased: false,
    unlocked: true,
    tier: 7
  },
  {
    id: 'power8',
    name: 'Power Infinity',
    description: '250x click power',
    cost: 2500000,
    category: 'power',
    effect: { type: 'multiply_click', value: 250 },
    purchased: false,
    unlocked: true,
    tier: 8
  },

  // Automation Upgrades
  {
    id: 'auto1',
    name: 'Basic Automation',
    description: 'Increases generator speed by 25%',
    cost: 100,
    category: 'automation',
    effect: { type: 'automation_speed', value: 1.25 },
    purchased: false,
    unlocked: true,
    tier: 1
  },
  {
    id: 'auto2',
    name: 'Enhanced Automation',
    description: 'Increases generator speed by 50%',
    cost: 500,
    category: 'automation',
    effect: { type: 'automation_speed', value: 1.5 },
    purchased: false,
    unlocked: true,
    tier: 2
  },
  {
    id: 'auto3',
    name: 'Advanced Automation',
    description: 'Doubles generator speed',
    cost: 2500,
    category: 'automation',
    effect: { type: 'automation_speed', value: 2 },
    purchased: false,
    unlocked: true,
    tier: 3
  },
  {
    id: 'auto4',
    name: 'Quantum Automation',
    description: 'Triples generator speed',
    cost: 10000,
    category: 'automation',
    effect: { type: 'automation_speed', value: 3 },
    purchased: false,
    unlocked: true,
    tier: 4
  },
  {
    id: 'auto5',
    name: 'Hyper Automation',
    description: '5x generator speed',
    cost: 50000,
    category: 'automation',
    effect: { type: 'automation_speed', value: 5 },
    purchased: false,
    unlocked: true,
    tier: 5
  },
  {
    id: 'auto6',
    name: 'Ultimate Automation',
    description: '10x generator speed',
    cost: 250000,
    category: 'automation',
    effect: { type: 'automation_speed', value: 10 },
    purchased: false,
    unlocked: true,
    tier: 6
  },
  {
    id: 'auto7',
    name: 'Cosmic Automation',
    description: '25x generator speed',
    cost: 1000000,
    category: 'automation',
    effect: { type: 'automation_speed', value: 25 },
    purchased: false,
    unlocked: true,
    tier: 7
  },
  {
    id: 'auto8',
    name: 'Infinite Automation',
    description: '50x generator speed',
    cost: 5000000,
    category: 'automation',
    effect: { type: 'automation_speed', value: 50 },
    purchased: false,
    unlocked: true,
    tier: 8
  },

  // Quantum Upgrades
  {
    id: 'quantum1',
    name: 'Quantum Entanglement',
    description: 'All generators gain 50% efficiency',
    cost: 1000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 1.5 },
    purchased: false,
    unlocked: true,
    tier: 1
  },
  {
    id: 'quantum2',
    name: 'Quantum Superposition',
    description: 'Double all generator output',
    cost: 5000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 2 },
    purchased: false,
    unlocked: true,
    tier: 2
  },
  {
    id: 'quantum3',
    name: 'Quantum Tunneling',
    description: 'Triple all generator output',
    cost: 25000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 3 },
    purchased: false,
    unlocked: true,
    tier: 3
  },
  {
    id: 'quantum4',
    name: 'Quantum Field',
    description: '5x all generator output',
    cost: 100000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 5 },
    purchased: false,
    unlocked: true,
    tier: 4
  },
  {
    id: 'quantum5',
    name: 'Quantum Matrix',
    description: '10x all generator output',
    cost: 500000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 10 },
    purchased: false,
    unlocked: true,
    tier: 5
  },
  {
    id: 'quantum6',
    name: 'Quantum Realm',
    description: '25x all generator output',
    cost: 2500000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 25 },
    purchased: false,
    unlocked: true,
    tier: 6
  },
  {
    id: 'quantum7',
    name: 'Quantum Dimension',
    description: '50x all generator output',
    cost: 10000000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 50 },
    purchased: false,
    unlocked: true,
    tier: 7
  },
  {
    id: 'quantum8',
    name: 'Quantum Universe',
    description: '100x all generator output',
    cost: 50000000,
    category: 'quantum',
    effect: { type: 'quantum_boost', value: 100 },
    purchased: false,
    unlocked: true,
    tier: 8
  },

  // Synergy Upgrades
  {
    id: 'synergy1',
    name: 'Basic Synergy',
    description: 'Generators boost each other by 10%',
    cost: 2000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 0.1 },
    purchased: false,
    unlocked: true,
    tier: 1
  },
  {
    id: 'synergy2',
    name: 'Enhanced Synergy',
    description: 'Generators boost each other by 25%',
    cost: 10000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 0.25 },
    purchased: false,
    unlocked: true,
    tier: 2
  },
  {
    id: 'synergy3',
    name: 'Advanced Synergy',
    description: 'Generators boost each other by 50%',
    cost: 50000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 0.5 },
    purchased: false,
    unlocked: true,
    tier: 3
  },
  {
    id: 'synergy4',
    name: 'Quantum Synergy',
    description: 'Generators boost each other by 100%',
    cost: 250000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 1 },
    purchased: false,
    unlocked: true,
    tier: 4
  },
  {
    id: 'synergy5',
    name: 'Hyper Synergy',
    description: 'Generators boost each other by 200%',
    cost: 1000000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 2 },
    purchased: false,
    unlocked: true,
    tier: 5
  },
  {
    id: 'synergy6',
    name: 'Ultimate Synergy',
    description: 'Generators boost each other by 400%',
    cost: 5000000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 4 },
    purchased: false,
    unlocked: true,
    tier: 6
  },
  {
    id: 'synergy7',
    name: 'Cosmic Synergy',
    description: 'Generators boost each other by 800%',
    cost: 25000000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 8 },
    purchased: false,
    unlocked: true,
    tier: 7
  },
  {
    id: 'synergy8',
    name: 'Infinite Synergy',
    description: 'Generators boost each other by 1600%',
    cost: 100000000,
    category: 'synergy',
    effect: { type: 'synergy_boost', value: 16 },
    purchased: false,
    unlocked: true,
    tier: 8
  },
];

export function useGame() {
  const [pwr, setPwr] = useState(0);
  const [pwrPerClick, setPwrPerClick] = useState(1);
  const [generators, setGenerators] = useState<GeneratorType[]>(INITIAL_GENERATORS);
  const [upgrades, setUpgrades] = useState<UpgradeType[]>(INITIAL_UPGRADES);

  const calculateBonus = useCallback((genId: string) => {
    let bonus = 1;
    const purchasedUpgrades = upgrades.filter(u => u.purchased);
    
    // Apply automation upgrades
    const autoBonus = purchasedUpgrades
      .filter(u => u.category === 'automation')
      .reduce((acc, u) => acc * u.effect.value, 1);
    bonus *= autoBonus;

    // Apply quantum upgrades
    const quantumBonus = purchasedUpgrades
      .filter(u => u.category === 'quantum')
      .reduce((acc, u) => acc * u.effect.value, 1);
    bonus *= quantumBonus;

    // Apply synergy upgrades
    const synergyBonus = purchasedUpgrades
      .filter(u => u.category === 'synergy')
      .reduce((acc, u) => {
        const otherGenerators = generators.filter(g => g.id !== genId);
        const totalOwnedGenerators = otherGenerators.reduce((sum, g) => sum + g.owned, 0);
        return acc * (1 + u.effect.value * totalOwnedGenerators);
      }, 1);
    bonus *= synergyBonus;

    return bonus;
  }, [generators, upgrades]);

  const pwrPerSecond = generators.reduce((total, gen) => {
    const bonus = calculateBonus(gen.id);
    return total + gen.production * gen.owned * bonus;
  }, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPwr(current => current + pwrPerSecond / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [pwrPerSecond]);

  useEffect(() => {
    const hasGeneratorRequirement = generators.some(g => g.owned >= 5 && g.category === 'generators');

    setGenerators(current =>
      current.map(gen => ({
        ...gen,
        unlocked: gen.category === 'generators' || hasGeneratorRequirement,
      }))
    );

    setUpgrades(current =>
      current.map(upgrade => ({
        ...upgrade,
        unlocked: !upgrade.requires || upgrade.requires.every(req =>
          generators.find(gen => gen.id === req && gen.owned > 0)
        ),
      }))
    );
  }, [generators.map(g => g.owned).join(',')]);

  const handleClick = () => {
    setPwr(current => current + pwrPerClick);
  };

  const purchaseGenerator = (id: string) => {
    setGenerators(current =>
      current.map(gen => {
        if (gen.id === id && pwr >= gen.cost) {
          setPwr(p => p - gen.cost);
          return {
            ...gen,
            owned: gen.owned + 1,
            cost: Math.floor(gen.baseCost * Math.pow(1.15, gen.owned + 1)),
          };
        }
        return gen;
      })
    );
  };

  const purchaseUpgrade = (id: string) => {
    setUpgrades(current =>
      current.map(upgrade => {
        if (upgrade.id === id && !upgrade.purchased && pwr >= upgrade.cost) {
          setPwr(p => p - upgrade.cost);
          if (upgrade.effect.type === 'multiply_click') {
            setPwrPerClick(current => current * upgrade.effect.value);
          }
          return { ...upgrade, purchased: true };
        }
        return upgrade;
      })
    );
  };

  return {
    pwr,
    pwrPerClick,
    pwrPerSecond,
    generators,
    upgrades,
    handleClick,
    purchaseGenerator,
    purchaseUpgrade,
  };
}