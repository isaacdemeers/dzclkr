'use client';

import { useState, useCallback } from 'react';

export function useProgress() {
    const [level, setLevel] = useState(0);
    const [progress, setProgress] = useState(0);
    const [requiredExp, setRequiredExp] = useState(100);

    const addProgress = useCallback((amount: number) => {
        setProgress(prev => {
            const newProgress = prev + amount;
            if (newProgress >= requiredExp) {
                setLevel(lvl => lvl + 1);
                setRequiredExp(req => req * 1.5);
                return 0;
            }
            return newProgress;
        });
    }, [requiredExp]);

    const reset = useCallback(() => {
        setLevel(0);
        setProgress(0);
        setRequiredExp(100);
    }, []);

    return {
        level,
        progress,
        requiredExp,
        addProgress,
        reset
    };
} 