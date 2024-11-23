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
        effect: 'pwr_per_second' as const
    },
    clickers: {
        description: (production: number) => `Adds ${production.toFixed(1)} PWR per click`,
        effect: 'pwr_per_click' as const
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
            baseCost: previousGenerator ? previousGenerator.cost * 3 : 25,
            baseProduction: previousGenerator ? previousGenerator.production * 2 : 0.1,
            costMultiplier: 3.0,
            productionMultiplier: 3.0
        },
        clickers: {
            baseCost: previousGenerator ? previousGenerator.cost * 3 : 25,
            baseProduction: previousGenerator ? previousGenerator.production * 2 : 0.1,
            costMultiplier: 3.0,
            productionMultiplier: 3.0
        }
    };

    const values = baseValues[category];

    // Calcul du coût basé sur le coût précédent
    const cost = Math.floor(values.baseCost * Math.pow(values.costMultiplier, tier));

    // Production basée sur la production précédente
    const baseProduction = values.baseProduction;
    const tierBonus = 1 + (tier * 0.2);
    const pwrBonus = 1 + (Math.log10(totalPwr + 1) * 0.05);
    const production = baseProduction * tierBonus * pwrBonus;

    return {
        cost: Math.max(25, Math.floor(cost)),
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
    // Rendre le prochain générateur disponible quand on a 50% du coût du dernier
    return totalPwr >= lastGenerator.cost * 0.5;
}

export function updateGenerators(generators: GeneratorType[], totalPwr: number): GeneratorType[] {
    // Ne pas mettre à jour les stats des générateurs non achetés
    const updatedGenerators = generators.map((gen) => {
        if (gen.owned > 0) {
            return gen; // Ne pas modifier les générateurs déjà achetés
        }
        return gen; // Garder les mêmes stats pour les générateurs non achetés
    });

    // Vérifier les nouveaux générateurs pour chaque catégorie
    const categories: ('generators' | 'clickers')[] = ['generators', 'clickers'];
    let newGenerators = [...updatedGenerators];

    categories.forEach(category => {
        const categoryGenerators = newGenerators.filter(g => g.category === category);
        if (shouldGenerateNewGenerator(totalPwr, categoryGenerators)) {
            const newGenerator = generateNewGenerator(totalPwr, categoryGenerators, category);
            newGenerators.push(newGenerator);
        }
    });

    return newGenerators;
} 