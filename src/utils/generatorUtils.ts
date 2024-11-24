import { GeneratorType } from '@/types/game';

const GENERATOR_PREFIXES = [
    'Basic', 'Advanced', 'Quantum', 'Fusion', 'Plasma',
    'Neural', 'Cosmic', 'Void', 'Dark Matter', 'Antimatter',
    'Temporal', 'Dimensional', 'Stellar', 'Galactic', 'Universal'
];

const GENERATOR_SUFFIXES = [
    'Generator', 'Reactor', 'Amplifier', 'Converter', 'Core',
    'Matrix', 'Node', 'Nexus', 'Array', 'Chamber',
    'Engine', 'Catalyst', 'Synthesizer', 'Accelerator', 'Conduit'
];

const CLICKER_PREFIXES = [
    'Basic', 'Advanced', 'Quantum', 'Neural', 'Plasma',
    'Void', 'Dark', 'Cosmic', 'Temporal', 'Dimensional',
    'Stellar', 'Galactic', 'Universal', 'Infinite', 'Omnipotent'
];

const CLICKER_SUFFIXES = [
    'Clicker', 'Booster', 'Enhancer', 'Amplifier', 'Accelerator',
    'Catalyst', 'Multiplier', 'Augmentor', 'Intensifier', 'Maximizer'
];

// Définir les effets par catégorie
const CATEGORY_EFFECTS = {
    generators: {
        description: (production: number) => `Generates ${production.toFixed(1)} PWR per second`,
        effect: { type: 'generate' as const, value: 1 }
    },
    clickers: {
        description: (production: number) => `Adds ${production.toFixed(1)} PWR per click`,
        effect: { type: 'multiply_click' as const, value: 1 }
    }
};

export function generateName(tier: number, category: 'generators' | 'clickers'): string {
    if (category === 'generators') {
        const prefixIndex = Math.min(tier, GENERATOR_PREFIXES.length - 1);
        const suffixIndex = Math.floor(tier / GENERATOR_PREFIXES.length);
        return `${GENERATOR_PREFIXES[prefixIndex]} ${GENERATOR_SUFFIXES[suffixIndex % GENERATOR_SUFFIXES.length]}`;
    } else {
        const prefixIndex = Math.min(tier, CLICKER_PREFIXES.length - 1);
        const suffixIndex = Math.floor(tier / CLICKER_PREFIXES.length);
        return `${CLICKER_PREFIXES[prefixIndex]} ${CLICKER_SUFFIXES[suffixIndex % CLICKER_SUFFIXES.length]}`;
    }
}

export function calculateGeneratorStats(
    totalPwr: number,
    tier: number,
    category: 'generators' | 'clickers',
    previousGenerator?: { production: number; cost: number }
) {
    const baseValues = {
        generators: {
            baseCost: previousGenerator ? previousGenerator.cost * 1.95 : 25,
            baseProduction: previousGenerator ? previousGenerator.production * 2.6 : 0.13,
            costMultiplier: totalPwr >= 5e14 ? 1.5 : 1.95,
            productionMultiplier: 3.9
        },
        clickers: {
            baseCost: previousGenerator ? previousGenerator.cost * 1.95 : 25,
            baseProduction: previousGenerator ? previousGenerator.production * 2.6 : 0.13,
            costMultiplier: totalPwr >= 5e14 ? 1.5 : 1.95,
            productionMultiplier: 3.9
        }
    };

    const values = baseValues[category];

    // Calcul du coût avec une progression réduite après 500T
    let cost = values.baseCost;
    if (totalPwr >= 5e14) {
        // Progression plus douce après 500T
        cost = Math.floor(values.baseCost * Math.pow(1.5, tier));
    } else {
        cost = Math.floor(values.baseCost * Math.pow(values.costMultiplier, tier));
    }

    // Production augmentée de 30%
    const baseProduction = values.baseProduction;
    const tierBonus = 1 + (tier * 0.26);
    const pwrBonus = 1 + (Math.log10(totalPwr + 1) * 0.065);
    const production = baseProduction * tierBonus * pwrBonus;

    return {
        cost: Math.max(25, Math.floor(cost * 0.65)),
        production: production
    };
}

export function generateNewGenerator(
    totalPwr: number,
    existingGenerators: GeneratorType[],
    category: 'generators' | 'clickers'
): GeneratorType {
    const categoryGenerators = existingGenerators.filter(g => g.category === category);
    const tier = categoryGenerators.length;

    // Trouver le dernier générateur de la même catégorie
    const lastGenerator = categoryGenerators[categoryGenerators.length - 1];
    const previousStats = lastGenerator ? {
        production: lastGenerator.production,
        cost: lastGenerator.cost
    } : undefined;

    // Calculer les stats en utilisant les stats précédentes
    const { cost, production } = calculateGeneratorStats(
        totalPwr,
        tier,
        category,
        previousStats
    );

    const categoryEffect = CATEGORY_EFFECTS[category];

    return {
        id: `${category}_${tier}`,
        name: generateName(tier, category),
        type: 'generator',
        cost,
        baseCost: cost,
        production,
        owned: 0,
        category,
        description: categoryEffect.description(production),
        effect: categoryEffect.effect,
        unlocked: true
    };
}

export function shouldGenerateNewGenerator(totalPwr: number, generators: GeneratorType[]): boolean {
    if (generators.length === 0) return true;

    const lastGenerator = generators[generators.length - 1];
    // Rendre le prochain générateur disponible plus tôt avec le coût réduit
    return totalPwr >= lastGenerator.cost * 0.3;
}

export function updateGenerators(generators: GeneratorType[], totalPwr: number): GeneratorType[] {
    // Met à jour les stats des générateurs existants
    const updatedGenerators = generators.map((gen) => {
        if (gen.owned > 0) {
            return gen; // Ne pas modifier les générateurs déjà achetés
        }
        return gen; // Garder les mêmes stats pour les générateurs non achetés
    });

    // Vérifier les nouveaux générateurs pour chaque catégorie
    const categories: ('generators' | 'clickers')[] = ['generators', 'clickers'];
    const newGenerators = [...updatedGenerators];

    categories.forEach(category => {
        const categoryGenerators = newGenerators.filter(g => g.category === category);
        if (shouldGenerateNewGenerator(totalPwr, categoryGenerators)) {
            const newGenerator = generateNewGenerator(totalPwr, categoryGenerators, category);
            newGenerators.push(newGenerator);
        }
    });

    return newGenerators;
} 