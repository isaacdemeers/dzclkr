'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Cpu, Shield, Atom, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Generator {
    id: string;
    name: string;
    cost: number;
    production: number;
    owned: number;
}

interface Upgrade {
    id: string;
    name: string;
    cost: number;
    purchased: boolean;
    description: string;
    category: 'basic' | 'advanced' | 'military' | 'quantum';
}

interface ShopProps {
    generators: Generator[];
    upgrades: Upgrade[];
    pwr: number;
    onPurchaseGenerator: (id: string) => void;
    onPurchaseUpgrade: (id: string) => void;
}

export function Shop({ generators, upgrades, pwr, onPurchaseGenerator, onPurchaseUpgrade }: ShopProps) {
    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="generators" className="w-full flex flex-col flex-1">
                <TabsList className="grid grid-cols-5 bg-black/50 border border-[#FFA944]/10 flex-none">
                    {[
                        { value: 'generators', icon: Zap, label: 'GENERATORS', color: 'green' },
                        { value: 'basic', icon: Cpu, label: 'BASIC', color: 'blue' },
                        { value: 'advanced', icon: Shield, label: 'ADVANCED', color: 'purple' },
                        { value: 'military', icon: Shield, label: 'MILITARY', color: 'red' },
                        { value: 'quantum', icon: Atom, label: 'QUANTUM', color: 'yellow' }
                    ].map((tab, index) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className={`
                                relative overflow-hidden
                                data-[state=active]:bg-[#FFA944]/10 
                                data-[state=active]:text-[#FFA944]
                                px-3 py-2
                                ${index !== 4 ? 'border-r border-[#FFA944]/10' : ''}
                                transition-all duration-200
                                hover:bg-[#FFA944]/5
                                group
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFA944]/0 via-[#FFA944]/5 to-[#FFA944]/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                <span className="font-mono text-xs tracking-wider">{tab.label}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFA944]/0 data-[state=active]:bg-[#FFA944]/50 transition-colors"></div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="generators" className="flex-1 mt-4 overflow-y-auto pr-2 space-y-2">
                    {generators.map((generator) => (
                        <div
                            key={generator.id}
                            className={`
                                bg-black/50 border border-[#FFA944]/5 rounded-lg p-4 
                                transition-all duration-200
                                ${pwr >= generator.cost
                                    ? 'hover:bg-[#FFA944]/5'
                                    : 'opacity-50'
                                }
                            `}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-sans font-bold text-white">{generator.name}</div>
                                    <div className="text-xs text-[#FFA944] font-mono tracking-wider">
                                        OUTPUT: {generator.production.toFixed(2)} PWR/s
                                    </div>
                                    <div className="text-xs text-zinc-500 font-mono mt-1">
                                        OWNED: {generator.owned}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onPurchaseGenerator(generator.id)}
                                    disabled={pwr < generator.cost}
                                    className="relative px-6 py-4 h-auto border-[#FFA944]/20 bg-black/50 hover:bg-[#FFA944]/10 hover:text-[#FFA944] transition-all duration-200 group"
                                >
                                    <div className="absolute inset-0 bg-[#FFA944]/5 rounded-md blur-sm group-hover:bg-[#FFA944]/10 transition-all duration-200"></div>
                                    <div className="relative flex items-center gap-2">
                                        <span className="font-mono text-xs">
                                            {generator.cost.toFixed(2)} PWR
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    ))}
                </TabsContent>

                {['basic', 'advanced', 'military', 'quantum'].map((category) => (
                    <TabsContent
                        key={category}
                        value={category}
                        className="flex-1 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFA944]/20 scrollbar-track-transparent pr-2 space-y-2"
                    >
                        {upgrades
                            .filter((upgrade) => upgrade.category === category)
                            .map((upgrade) => (
                                <div
                                    key={upgrade.id}
                                    className={`
                                        bg-black/50 border border-[#FFA944]/5 rounded-lg p-4
                                        transition-all duration-200
                                        ${upgrade.purchased
                                            ? 'opacity-50'
                                            : pwr >= upgrade.cost
                                                ? 'hover:bg-[#FFA944]/5'
                                                : 'opacity-50'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-sans font-bold text-white">
                                                {upgrade.name}
                                            </div>
                                            <div className="text-xs text-[#FFA944] font-mono tracking-wider">
                                                {upgrade.description}
                                            </div>
                                            <div className="text-xs text-zinc-500 font-mono mt-1">
                                                {upgrade.purchased ? 'PURCHASED' : pwr >= upgrade.cost ? 'AVAILABLE' : 'INSUFFICIENT POWER'}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => onPurchaseUpgrade(upgrade.id)}
                                            disabled={upgrade.purchased || pwr < upgrade.cost}
                                            className="relative px-6 py-4 h-auto border-[#FFA944]/20 bg-black/50 hover:bg-[#FFA944]/10 hover:text-[#FFA944] transition-all duration-200 group disabled:opacity-50"
                                        >
                                            <div className="absolute inset-0 bg-[#FFA944]/5 rounded-md blur-sm group-hover:bg-[#FFA944]/10 transition-all duration-200"></div>
                                            <div className="relative flex items-center gap-2">
                                                <span className="font-mono text-xs">
                                                    {upgrade.cost.toFixed(2)} PWR
                                                </span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
} 