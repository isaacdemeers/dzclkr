'use client';

import { Badge } from "@/components/ui/badge";
import { Gauge } from "lucide-react";

interface StatsProps {
    pwr: number;
    pwrPerSecond: number;
    pwrPerClick: number;
}

export function Stats({ pwr, pwrPerSecond, pwrPerClick }: StatsProps) {
    return (
        <div className="flex justify-center gap-6 mt-4">
            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <div>
                    <div className="text-xl font-mono">{pwr.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">PWR</div>
                </div>
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
                <div>
                    <div className="text-xl font-mono">{pwrPerSecond.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">PWR/s</div>
                </div>
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
                <div>
                    <div className="text-xl font-mono">{pwrPerClick.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">PWR/click</div>
                </div>
            </Badge>
        </div>
    );
} 