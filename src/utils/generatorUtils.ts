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

// Définir les effets par catégorie
const CATEGORY_EFFECTS = {
    generators: {
        description: (production: number) => `Generates ${production.toFixed(1)} PWR per second`,
        effect: 'pwr_per_second'
    },
    basic: {
        description: (production: number) => `Adds ${production.toFixed(1)} PWR per click`,
        effect: 'pwr_per_click'
    },
    advanced: {
        description: (production: number) => `Multiplies all generators by ${production.toFixed(1)}x`,
        effect: 'generator_multiplier'
    },
    military: {
        description: (production: number) => `Multiplies PWR per click by ${production.toFixed(1)}x`,
        effect: 'click_multiplier'
    },
    quantum: {
        description: (production: number) => `Multiplies all production by ${production.toFixed(1)}x`,
        effect: 'global_multiplier'
    }
};

export function generateName(tier: number): string {
    const prefixIndex = Math.min(tier, GENERATOR_PREFIXES.length - 1);
    const suffixIndex = Math.floor(tier / GENERATOR_PREFIXES.length);
    return `${GENERATOR_PREFIXES[prefixIndex]} ${GENERATOR_SUFFIXES[suffixIndex % GENERATOR_SUFFIXES.length]}`;
}

export function calculateGeneratorStats(totalPwr: number, tier: number) {
    // Base cost augmente exponentiellement avec le tier
    const baseCost = Math.pow(10, tier + 1);

    // Production augmente plus rapidement que le coût
    const baseProduction = Math.pow(1.5, tier) * (tier + 1);

    // Ajustement en fonction du PWR total
    const costMultiplier = 1 + (Math.log10(totalPwr + 1) * 0.1);
    const productionMultiplier = 1 + (Math.log10(totalPwr + 1) * 0.2);

    return {
        cost: Math.floor(baseCost * costMultiplier),
        production: baseProduction * productionMultiplier
    };
}

export function generateNewGenerator(totalPwr: number, existingGenerators: GeneratorType[]): GeneratorType {
    const tier = existingGenerators.length;
    const { cost, production } = calculateGeneratorStats(totalPwr, tier);

    // Tous les générateurs sont maintenant dans la catégorie 'generators'
    const category = 'generators';
    const categoryEffect = CATEGORY_EFFECTS[category];

    return {
        id: `gen_${tier}`,
        name: generateName(tier),
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
    const nextGeneratorCost = Math.pow(10, generators.length + 1);

    // Génère un nouveau générateur quand le joueur a accumulé assez de PWR
    return totalPwr >= nextGeneratorCost * 0.5;
}

export function updateGenerators(generators: GeneratorType[], totalPwr: number): GeneratorType[] {
    // Met à jour les stats des générateurs existants
    const updatedGenerators = generators.map((gen, index) => {
        const { cost, production } = calculateGeneratorStats(totalPwr, index);
        return {
            ...gen,
            production: gen.owned > 0 ? production : gen.production
        };
    });

    // Ajoute un nouveau générateur si nécessaire
    if (shouldGenerateNewGenerator(totalPwr, generators)) {
        const newGenerator = generateNewGenerator(totalPwr, generators);
        return [...updatedGenerators, newGenerator];
    }

    return updatedGenerators;
} 