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
        { id: 'basic1', category: 'basic', name: 'Enhanced Circuits', cost: 5, purchased: false, description: 'Increase click power by 50%', multiplier: 1.5 },
        { id: 'basic2', category: 'basic', name: 'Power Optimization', cost: 15, purchased: false, description: 'Increase generator efficiency by 50%', multiplier: 1.5 },
        { id: 'basic3', category: 'basic', name: 'Basic Overclocking', cost: 30, purchased: false, description: 'Boost all power by 50%', multiplier: 1.5 },
        { id: 'basic4', category: 'basic', name: 'Improved Wiring', cost: 50, purchased: false, description: 'Better power distribution by 50%', multiplier: 1.5 },

        // Advanced Upgrades (x2 multipliers)
        { id: 'advanced1', category: 'advanced', name: 'Neural Network', cost: 100, purchased: false, description: 'Double power generation', multiplier: 2 },
        { id: 'advanced2', category: 'advanced', name: 'Quantum Circuits', cost: 250, purchased: false, description: 'Double power flow', multiplier: 2 },
        { id: 'advanced3', category: 'advanced', name: 'Fusion Core', cost: 500, purchased: false, description: 'Double generation', multiplier: 2 },
        { id: 'advanced4', category: 'advanced', name: 'Dark Matter Injection', cost: 1000, purchased: false, description: 'Double power boost', multiplier: 2 },

        // Military Upgrades (x2.5 multipliers)
        { id: 'military1', category: 'military', name: 'Tactical Override', cost: 2000, purchased: false, description: '2.5x power systems', multiplier: 2.5 },
        { id: 'military2', category: 'military', name: 'Defense Matrix', cost: 5000, purchased: false, description: '2.5x power generation', multiplier: 2.5 },
        { id: 'military3', category: 'military', name: 'Strategic Boost', cost: 10000, purchased: false, description: '2.5x power enhancement', multiplier: 2.5 },
        { id: 'military4', category: 'military', name: 'Combat Protocols', cost: 20000, purchased: false, description: '2.5x systems', multiplier: 2.5 },

        // Quantum Upgrades (x3 multipliers)
        { id: 'quantum1', category: 'quantum', name: 'Timeline Manipulation', cost: 50000, purchased: false, description: 'Triple power generation', multiplier: 3 },
        { id: 'quantum2', category: 'quantum', name: 'Reality Distortion', cost: 100000, purchased: false, description: 'Triple energy output', multiplier: 3 },
        { id: 'quantum3', category: 'quantum', name: 'Dimensional Tap', cost: 250000, purchased: false, description: 'Triple power extraction', multiplier: 3 },
        { id: 'quantum4', category: 'quantum', name: 'Universal Constant', cost: 500000, purchased: false, description: 'Triple all power', multiplier: 3 },
    ]);

    const [powerBoostActive, setPowerBoostActive] = useState(false);

    const progress = useProgress();

    const handleClick = useCallback(() => {
        setPwr((current) => {
            const clickValue = powerBoostActive ? 10_000_000 : pwrPerClick;
            return current + clickValue;
        });

        progress.addProgress(pwrPerClick * 0.1);
    }, [pwrPerClick, powerBoostActive, progress]);

    const togglePowerBoost = useCallback(() => {
        setPowerBoostActive(prev => !prev);
    }, []);

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

    const calculateEffects = useCallback(() => {
        let totalClickMultiplier = 1;
        let totalGeneratorMultiplier = 1;
        let additionalClickPower = 0;

        generators.forEach(gen => {
            if (gen.owned === 0) return;

            if (gen.effect === 'pwr_per_click') {
                // Garder la production originale pour les générateurs possédés
                additionalClickPower += gen.production * gen.owned;
            }
        });

        // Mettre à jour pwrPerClick
        const baseClickPower = 0.1;
        setPwrPerClick((baseClickPower + additionalClickPower) * totalClickMultiplier);
    }, [generators]);

    const calculatePwrPerSecond = useCallback(() => {
        const baseProduction = generators
            .filter(gen => gen.effect === 'pwr_per_second' && gen.owned > 0)
            .reduce((acc, gen) => {
                // Garder la production originale pour les générateurs possédés
                return acc + (gen.production * gen.owned);
            }, 0);

        setPwrPerSecond(baseProduction);
    }, [generators]);

    // Mettre à jour les effets quand les générateurs changent
    useEffect(() => {
        calculateEffects();
        calculatePwrPerSecond();
    }, [generators, calculateEffects, calculatePwrPerSecond]);

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

    const purchaseGenerator = useCallback((id: string) => {
        // Vérifier d'abord si l'achat est possible
        const generator = generators.find(g => g.id === id);
        if (!generator || generator.cost > pwr) {
            return;
        }

        // Déduire le coût une seule fois, avant la mise à jour du générateur
        const cost = generator.cost;
        setPwr(currentPwr => currentPwr - cost);

        // Mettre à jour le générateur séparément
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

    // Réinitialisation des améliorations au niveau 50 et tous les 100 niveaux ensuite
    useEffect(() => {
        // Réinitialisation au niveau 50
        if (progress.level === 50) {
            setUpgrades(current =>
                current.map(upgrade => ({
                    ...upgrade,
                    purchased: false
                }))
            );
        }
        // Réinitialisation tous les 100 niveaux après le niveau 100
        else {
            const resetLevel = Math.floor(progress.level / 100) * 100;
            if (progress.level >= 100 && progress.level === resetLevel) {
                setUpgrades(current =>
                    current.map(upgrade => ({
                        ...upgrade,
                        purchased: false
                    }))
                );
            }
        }
    }, [progress.level]);

    const purchaseUpgrade = useCallback((id: string) => {
        const upgrade = upgrades.find((u) => u.id === id);
        if (!upgrade || upgrade.purchased || pwr < upgrade.cost) return;

        // Déduire le coût une seule fois
        setPwr(current => current - upgrade.cost);

        setUpgrades(
            upgrades.map((u) => (u.id === id ? { ...u, purchased: true } : u))
        );

        // Appliquer les multiplicateurs en fonction de la catégorie avec des valeurs plus faibles
        switch (upgrade.category) {
            case 'basic':
                setPwrPerClick(current => current * upgrade.multiplier);
                break;
            case 'advanced':
                setGenerators(prev =>
                    prev.map((g) => ({ ...g, production: g.production * upgrade.multiplier }))
                );
                break;
            case 'military':
                setPwrPerClick(current => current * upgrade.multiplier);
                setGenerators(prev =>
                    prev.map((g) => ({ ...g, production: g.production * (upgrade.multiplier / 2) }))
                );
                break;
            case 'quantum':
                setPwrPerClick(current => current * upgrade.multiplier);
                setGenerators(prev =>
                    prev.map((g) => ({ ...g, production: g.production * upgrade.multiplier }))
                );
                break;
        }

        calculatePwrPerSecond();
    }, [pwr, upgrades, calculatePwrPerSecond]);

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