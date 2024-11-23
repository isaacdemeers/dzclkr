import React from 'react';
import { Shield } from 'lucide-react';
import { formatNumber } from '@/app/utils/formatNumber';

interface PlayerCardProps {
    level: number;
    progress: number;
    requiredExp: number;
}

export function PlayerCard({ level, progress, requiredExp }: PlayerCardProps) {
    return (
        <div className="relative bg-black/40 border border-[#FFA944]/20 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-between">
                {/* Niveau du système */}
                <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-[#FFA944]" />
                    <div>
                        <div className="text-6xl font-bold text-[#FFA944]">{level}</div>
                        <div className="text-sm font-mono text-zinc-500">SYSTEM LEVEL</div>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="flex-1 max-w-[400px] ml-12">
                    <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-300 bg-[#FFA944]"
                            style={{
                                width: `${(progress / requiredExp) * 100}%`,
                                boxShadow: '0 0 10px rgba(255, 169, 68, 0.5)',
                            }}
                        />
                    </div>
                    <div className="text-xs font-mono text-zinc-500 mt-2 text-center">
                        {formatNumber(requiredExp - progress)} PWR TO NEXT LEVEL
                    </div>
                </div>
            </div>
        </div>
    );
} 