'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from './useProgress';
import { updateGenerators, generateNewGenerator } from '@/utils/generatorUtils';
import { GeneratorType } from '@/types/game';

// Types pour les améliorations
type UpgradeCategory = 'basic' | 'advanced' | 'military' | 'quantum';

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
    const [generators, setGenerators] = useState<GeneratorType[]>([
        generateNewGenerator(0, [], 'generators'), // Premier générateur de PWR/sec
        generateNewGenerator(0, [], 'clickers')    // Premier générateur de PWR/click
    ]);

    const [upgrades, setUpgrades] = useState<Upgrade[]>([
        // Basic Upgrades (x1.5 multipliers)
        { id: 'basic1', category: 'basic', name: 'Enhanced Circuits', cost: 25, purchased: false, description: 'Increase click power by 50%', multiplier: 1.5 },
        { id: 'basic2', category: 'basic', name: 'Power Optimization', cost: 125, purchased: false, description: 'Increase generator efficiency by 50%', multiplier: 1.5 },
        { id: 'basic3', category: 'basic', name: 'Basic Overclocking', cost: 500, purchased: false, description: 'Boost all power by 50%', multiplier: 1.5 },
        { id: 'basic4', category: 'basic', name: 'Improved Wiring', cost: 2500, purchased: false, description: 'Better power distribution by 50%', multiplier: 1.5 },

        // Advanced Upgrades (x2 multipliers)
        { id: 'advanced1', category: 'advanced', name: 'Neural Network', cost: 12500, purchased: false, description: 'Double power generation', multiplier: 2 },
        { id: 'advanced2', category: 'advanced', name: 'Quantum Circuits', cost: 50000, purchased: false, description: 'Double power flow', multiplier: 2 },
        { id: 'advanced3', category: 'advanced', name: 'Fusion Core', cost: 250000, purchased: false, description: 'Double generation', multiplier: 2 },
        { id: 'advanced4', category: 'advanced', name: 'Dark Matter Injection', cost: 1250000, purchased: false, description: 'Double power boost', multiplier: 2 },

        // Military Upgrades (x2.5 multipliers)
        { id: 'military1', category: 'military', name: 'Tactical Override', cost: 5000000, purchased: false, description: '2.5x power systems', multiplier: 2.5 },
        { id: 'military2', category: 'military', name: 'Defense Matrix', cost: 25000000, purchased: false, description: '2.5x power generation', multiplier: 2.5 },
        { id: 'military3', category: 'military', name: 'Strategic Boost', cost: 125000000, purchased: false, description: '2.5x power enhancement', multiplier: 2.5 },
        { id: 'military4', category: 'military', name: 'Combat Protocols', cost: 500000000, purchased: false, description: '2.5x systems', multiplier: 2.5 },

        // Quantum Upgrades (x3 multipliers)
        { id: 'quantum1', category: 'quantum', name: 'Timeline Manipulation', cost: 2500000000, purchased: false, description: 'Triple power generation', multiplier: 3 },
        { id: 'quantum2', category: 'quantum', name: 'Reality Distortion', cost: 12500000000, purchased: false, description: 'Triple energy output', multiplier: 3 },
        { id: 'quantum3', category: 'quantum', name: 'Dimensional Tap', cost: 50000000000, purchased: false, description: 'Triple power extraction', multiplier: 3 },
        { id: 'quantum4', category: 'quantum', name: 'Universal Constant', cost: 250000000000, purchased: false, description: 'Triple all power', multiplier: 3 },
    ]);

    const [powerBoostActive, setPowerBoostActive] = useState(false);

    const progress = useProgress();

    // Calcul du multiplicateur total basé sur les améliorations achetées
    const calculateTotalMultiplier = useCallback(() => {
        return upgrades
            .filter(u => u.purchased)
            .reduce((total, upgrade) => total * upgrade.multiplier, 1);
    }, [upgrades]);

    // Calcul de la production par clic
    const calculatePwrPerClick = useCallback(() => {
        const baseClick = 0.1;
        const clickGenerators = generators.filter(g => g.category === 'clickers' && g.owned > 0);
        const clickBonus = clickGenerators.reduce((total, gen) => {
            return total + (gen.production * gen.owned);
        }, 0);
        const multiplier = calculateTotalMultiplier();
        return (baseClick + clickBonus) * multiplier;
    }, [generators, calculateTotalMultiplier]);

    // Calcul de la production par seconde
    const calculatePwrPerSecond = useCallback(() => {
        const productionGenerators = generators.filter(g => g.category === 'generators' && g.owned > 0);
        const baseProduction = productionGenerators.reduce((total, gen) => {
            return total + (gen.production * gen.owned);
        }, 0);
        const multiplier = calculateTotalMultiplier();
        return baseProduction * multiplier;
    }, [generators, calculateTotalMultiplier]);

    // Mise à jour des valeurs de production
    useEffect(() => {
        const newPwrPerClick = calculatePwrPerClick();
        const newPwrPerSecond = calculatePwrPerSecond();

        setPwrPerClick(newPwrPerClick);
        setPwrPerSecond(newPwrPerSecond);
    }, [generators, upgrades, calculatePwrPerClick, calculatePwrPerSecond]);

    // Production passive
    useEffect(() => {
        const interval = setInterval(() => {
            setPwr(current => {
                const gain = pwrPerSecond / 10; // Divisé par 10 car l'intervalle est de 100ms
                return current + gain;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [pwrPerSecond]);

    // Gestion du clic
    const handleClick = useCallback(() => {
        setPwr(current => current + pwrPerClick);
        progress.addProgress(pwrPerClick * 0.1);
    }, [pwrPerClick, progress]);

    // Achat de générateur
    const purchaseGenerator = useCallback((id: string) => {
        const generator = generators.find(g => g.id === id);
        if (!generator || generator.cost > pwr) return;

        setPwr(current => current - generator.cost);
        setGenerators(current =>
            current.map(gen => {
                if (gen.id === id) {
                    const newOwned = gen.owned + 1;
                    return {
                        ...gen,
                        owned: newOwned,
                        cost: Math.floor(gen.baseCost * Math.pow(1.15, newOwned)),
                    };
                }
                return gen;
            })
        );
    }, [pwr, generators]);

    // Achat d'amélioration
    const purchaseUpgrade = useCallback((id: string) => {
        const upgrade = upgrades.find(u => u.id === id);
        if (!upgrade || upgrade.purchased || upgrade.cost > pwr) return;

        setPwr(current => current - upgrade.cost);
        setUpgrades(current =>
            current.map(u => u.id === id ? { ...u, purchased: true } : u)
        );
    }, [pwr, upgrades]);

    // Vérifier et mettre à jour les générateurs périodiquement
    useEffect(() => {
        const updatedGenerators = updateGenerators(generators, pwr);
        if (updatedGenerators.length !== generators.length) {
            // Au lieu de remplacer tous les générateurs, ajoutons seulement les nouveaux
            const newGenerators = updatedGenerators.filter(
                newGen => !generators.some(existingGen => existingGen.id === newGen.id)
            );
            setGenerators(prev => [...prev, ...newGenerators]);
        }
    }, [pwr, generators]);

    const togglePowerBoost = useCallback(() => {
        setPowerBoostActive(prev => !prev);
    }, []);

    const resetGame = useCallback(() => {
        setPwr(0);
        setPwrPerClick(0.1);
        setPwrPerSecond(0);
        setGenerators([
            generateNewGenerator(0, [], 'generators'),
            generateNewGenerator(0, [], 'clickers')
        ]);
        setUpgrades(current =>
            current.map(upgrade => ({
                ...upgrade,
                purchased: false
            }))
        );
        setPowerBoostActive(false);
        progress.reset();
    }, [progress]);

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
        resetGame,
    };
} 