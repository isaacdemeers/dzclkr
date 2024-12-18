'use client';

import { useState, useCallback } from 'react';

const MAX_LEVEL = 300;

const calculateRequiredExp = (level: number): number => {
    // Formule exponentielle douce pour la progression
    return Math.floor(100 * Math.pow(1.25, level));
};

export function useProgress() {
    const [level, setLevel] = useState(0);
    const [progress, setProgress] = useState(0);
    const [requiredExp, setRequiredExp] = useState(calculateRequiredExp(0));

    const addProgress = useCallback((amount: number) => {
        setProgress(currentProgress => {
            let newProgress = currentProgress + amount;
            let currentLevel = level;

            // Tant qu'il y a assez d'XP pour monter de niveau et qu'on n'a pas atteint le max
            while (newProgress >= calculateRequiredExp(currentLevel) && currentLevel < MAX_LEVEL) {
                newProgress -= calculateRequiredExp(currentLevel);
                currentLevel++;
                setLevel(currentLevel);
                setRequiredExp(calculateRequiredExp(currentLevel));
            }

            // Si on est au niveau max, on ne garde pas le surplus d'XP
            if (currentLevel >= MAX_LEVEL) {
                return 0;
            }

            return newProgress;
        });
    }, [level]);

    const reset = useCallback(() => {
        setLevel(0);
        setProgress(0);
        setRequiredExp(calculateRequiredExp(0));
    }, []);

    return {
        level,
        progress,
        requiredExp,
        addProgress,
        reset,
        maxLevel: MAX_LEVEL
    };
} 