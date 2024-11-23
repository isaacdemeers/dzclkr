'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from './useProgress';

// Types pour les améliorations
type UpgradeCategory = 'basic' | 'advanced' | 'military' | 'quantum';

interface Generator {
    id: string;
    name: string;
    cost: number;
    production: number;
    owned: number;
}

interface Upgrade {
    id: string;
    name: string;
    cost: number;
    purchased: boolean;
    description: string;
    category: UpgradeCategory;
    multiplier: number;
}

export function useGame() {
    const [pwr, setPwr] = useState(0);
    const [pwrPerClick, setPwrPerClick] = useState(0.1);
    const [pwrPerSecond, setPwrPerSecond] = useState(0);
    const [generators, setGenerators] = useState([
        { id: 'gen1', name: 'Basic Generator', cost: 10, production: 0.1, owned: 0 },
        { id: 'gen2', name: 'Advanced Generator', cost: 100, production: 1, owned: 0 },
        { id: 'gen3', name: 'Quantum Generator', cost: 1000, production: 10, owned: 0 },
    ]);

    const [upgrades, setUpgrades] = useState<Upgrade[]>([
        // Basic Upgrades (x2 multipliers)
        { id: 'basic1', category: 'basic', name: 'Enhanced Circuits', cost: 5, purchased: false, description: 'Double click power', multiplier: 2 },
        { id: 'basic2', category: 'basic', name: 'Power Optimization', cost: 15, purchased: false, description: 'Increase generator efficiency', multiplier: 2 },
        { id: 'basic3', category: 'basic', name: 'Basic Overclocking', cost: 30, purchased: false, description: 'Boost all power generation', multiplier: 2 },
        { id: 'basic4', category: 'basic', name: 'Improved Wiring', cost: 50, purchased: false, description: 'Better power distribution', multiplier: 2 },

        // Advanced Upgrades (x3 multipliers)
        { id: 'advanced1', category: 'advanced', name: 'Neural Network', cost: 100, purchased: false, description: 'AI-powered optimization', multiplier: 3 },
        { id: 'advanced2', category: 'advanced', name: 'Quantum Circuits', cost: 250, purchased: false, description: 'Quantum-enhanced power flow', multiplier: 3 },
        { id: 'advanced3', category: 'advanced', name: 'Fusion Core', cost: 500, purchased: false, description: 'Advanced power generation', multiplier: 3 },
        { id: 'advanced4', category: 'advanced', name: 'Dark Matter Injection', cost: 1000, purchased: false, description: 'Exotic matter power boost', multiplier: 3 },

        // Military Upgrades (x5 multipliers)
        { id: 'military1', category: 'military', name: 'Tactical Override', cost: 2000, purchased: false, description: 'Military-grade power systems', multiplier: 5 },
        { id: 'military2', category: 'military', name: 'Defense Matrix', cost: 5000, purchased: false, description: 'Protected power generation', multiplier: 5 },
        { id: 'military3', category: 'military', name: 'Strategic Boost', cost: 10000, purchased: false, description: 'Tactical power enhancement', multiplier: 5 },
        { id: 'military4', category: 'military', name: 'Combat Protocols', cost: 20000, purchased: false, description: 'Warfare-optimized systems', multiplier: 5 },

        // Quantum Upgrades (x10 multipliers)
        { id: 'quantum1', category: 'quantum', name: 'Timeline Manipulation', cost: 50000, purchased: false, description: 'Bend time for power', multiplier: 10 },
        { id: 'quantum2', category: 'quantum', name: 'Reality Distortion', cost: 100000, purchased: false, description: 'Alter reality for energy', multiplier: 10 },
        { id: 'quantum3', category: 'quantum', name: 'Dimensional Tap', cost: 250000, purchased: false, description: 'Extract power from dimensions', multiplier: 10 },
        { id: 'quantum4', category: 'quantum', name: 'Universal Constant', cost: 500000, purchased: false, description: 'Rewrite physics for power', multiplier: 10 },
    ]);

    const [powerBoostActive, setPowerBoostActive] = useState(false);

    const progress = useProgress();

    const handleClick = useCallback(() => {
        setPwr((current) => {
            const clickValue = powerBoostActive ? 100 : pwrPerClick;
            return current + clickValue;
        });

        progress.addProgress(pwrPerClick * 0.1);
    }, [pwrPerClick, powerBoostActive, progress]);

    const togglePowerBoost = useCallback(() => {
        setPowerBoostActive(prev => !prev);
    }, []);

    const calculatePwrPerSecond = useCallback(() => {
        const total = generators.reduce((acc, gen) => {
            return acc + (gen.production * gen.owned);
        }, 0);
        setPwrPerSecond(total);
    }, [generators]);

    useEffect(() => {
        calculatePwrPerSecond();
    }, [generators, calculatePwrPerSecond]);

    useEffect(() => {
        let lastTick = Date.now();

        const interval = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTick) / 1000;
            lastTick = now;

            setPwr(current => current + pwrPerSecond * delta);
            progress.addProgress(pwrPerSecond * 0.02 * delta);
        }, 50);

        return () => clearInterval(interval);
    }, [pwrPerSecond, progress]);

    const purchaseGenerator = (id: string) => {
        const generator = generators.find((g) => g.id === id);
        if (!generator || pwr < generator.cost) return;

        setPwr((current) => current - generator.cost);
        setGenerators(
            generators.map((g) =>
                g.id === id
                    ? { ...g, owned: g.owned + 1, cost: Math.floor(g.cost * 1.15) }
                    : g
            )
        );
    };

    const purchaseUpgrade = (id: string) => {
        const upgrade = upgrades.find((u) => u.id === id);
        if (!upgrade || upgrade.purchased || pwr < upgrade.cost) return;

        setPwr((current) => current - upgrade.cost);
        setUpgrades(
            upgrades.map((u) => (u.id === id ? { ...u, purchased: true } : u))
        );

        // Appliquer les multiplicateurs en fonction de la catégorie
        if (upgrade.id.startsWith('basic')) {
            setPwrPerClick((current) => current * upgrade.multiplier);
        } else if (upgrade.id.startsWith('advanced')) {
            setGenerators(prev =>
                prev.map((g) => ({ ...g, production: g.production * upgrade.multiplier }))
            );
        } else if (upgrade.id.startsWith('military')) {
            setPwrPerClick((current) => current * upgrade.multiplier);
            setGenerators(prev =>
                prev.map((g) => ({ ...g, production: g.production * (upgrade.multiplier / 2) }))
            );
        } else if (upgrade.id.startsWith('quantum')) {
            setPwrPerClick((current) => current * upgrade.multiplier);
            setGenerators(prev =>
                prev.map((g) => ({ ...g, production: g.production * upgrade.multiplier }))
            );
        }

        // Recalculer le PWR/sec après l'application des multiplicateurs
        calculatePwrPerSecond();
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
        progress,
        powerBoostActive,
        togglePowerBoost,
    };
} 