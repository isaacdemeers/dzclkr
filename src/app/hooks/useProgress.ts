'use client';

import { useState, useCallback } from 'react';

interface ProgressState {
    level: number;
    progress: number;
    progressPercentage: number;
    color: string;
    requiredExp: number;
}

export function useProgress() {
    const getRequiredExp = useCallback((level: number) => {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }, []);

    const [state, setState] = useState<ProgressState>({
        level: 1,
        progress: 0,
        progressPercentage: 0,
        color: '#FFA944',
        requiredExp: getRequiredExp(1),
    });

    const addProgress = useCallback((amount: number) => {
        setState(current => {
            const requiredExp = getRequiredExp(current.level);
            let newProgress = current.progress + amount;
            let newLevel = current.level;

            // Vérifie si on passe un niveau
            while (newProgress >= requiredExp) {
                newProgress -= requiredExp;
                newLevel++;
            }

            // Change la couleur en fonction du niveau
            const colors = ['#FFA944', '#FF44AA', '#44AAFF', '#44FF44', '#AA44FF'];
            const color = colors[(newLevel - 1) % colors.length];

            return {
                level: newLevel,
                progress: newProgress,
                progressPercentage: (newProgress / requiredExp) * 100,
                color,
                requiredExp: getRequiredExp(newLevel),
            };
        });
    }, [getRequiredExp]);

    return {
        ...state,
        addProgress,
    };
} 