'use client';

import { useState, useCallback, useRef } from 'react';

const COLORS = [
    '#FFA944', // Orange (default)
    '#FF4444', // Red
    '#44FF44', // Green
    '#4444FF', // Blue
    '#FF44FF', // Purple
    '#44FFFF', // Cyan
    '#FFFF44', // Yellow
];

export function useProgress() {
    const [level, setLevel] = useState(1);
    const [progress, setProgress] = useState(0);
    const [color, setColor] = useState(COLORS[0]);
    const accumulatedProgress = useRef(0);

    const addProgress = useCallback((amount: number) => {
        accumulatedProgress.current += amount;

        // On met à jour l'état seulement si on a accumulé au moins 0.1%
        if (accumulatedProgress.current >= 0.1) {
            setProgress(currentProgress => {
                const newProgress = currentProgress + accumulatedProgress.current;
                accumulatedProgress.current = 0;

                if (newProgress >= 100) {
                    // Level up
                    setLevel(prev => prev + 1);
                    // Évite les couleurs consécutives identiques
                    const currentColorIndex = COLORS.indexOf(color);
                    let newColorIndex;
                    do {
                        newColorIndex = Math.floor(Math.random() * COLORS.length);
                    } while (newColorIndex === currentColorIndex);
                    setColor(COLORS[newColorIndex]);

                    // Retourne le surplus de progression
                    return newProgress - 100;
                }

                return newProgress;
            });
        }
    }, [color]);

    return {
        level,
        progress,
        color,
        addProgress,
        progressPercentage: Math.min(progress, 100)
    };
} 