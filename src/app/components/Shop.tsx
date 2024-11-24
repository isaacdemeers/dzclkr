'use client';

import { Button } from "@/components/ui/button";
import { Zap, Cpu, Shield, Atom, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/app/utils/formatNumber";

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
    const renderGeneratorList = (items: Generator[]) => (
        <div className="flex-1 mt-4 overflow-y-auto space-y-2">
            {items.map((generator) => (
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
                                {generator.category === 'generators'
                                    ? `OUTPUT: ${formatNumber(generator.production)} PWR/s`
                                    : `OUTPUT: +${formatNumber(generator.production)} PWR/click`
                                }
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
                                    {formatNumber(generator.cost)} PWR
                                </span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="generators" className="flex flex-col h-full">
                <TabsList className=" flex h-fit gap-2 flex-wrap bg-black/50 border border-[#FFA944]/10">
                    {[
                        { value: 'generators', icon: Zap, label: 'GENERATORS' },
                        { value: 'clickers', icon: Shield, label: 'CLICKERS' },
                        { value: 'basic', icon: Cpu, label: 'BASIC' },
                        { value: 'advanced', icon: Shield, label: 'ADVANCED' },
                        { value: 'military', icon: Shield, label: 'MILITARY' },
                        { value: 'quantum', icon: Atom, label: 'QUANTUM' }
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className={`
                                flex w-[32%]
                                relative overflow-hidden
                                data-[state=active]:bg-[#FFA944]/10 
                                data-[state=active]:text-[#FFA944]
                                px-3 py-2
                                transition-all duration-200
                                hover:bg-[#FFA944]/5
                                group
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFA944]/0 via-[#FFA944]/5 to-[#FFA944]/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                <span className="font-mono text-xs tracking-wider whitespace-nowrap">{tab.label}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFA944]/0 data-[state=active]:bg-[#FFA944]/50 transition-colors"></div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="flex-1 min-h-0">
                    <TabsContent value="generators" className="h-full overflow-y-auto ">
                        {renderGeneratorList(generators.filter(g => g.category === 'generators'))}
                    </TabsContent>

                    <TabsContent value="clickers" className="h-full overflow-y-auto">
                        {renderGeneratorList(generators.filter(g => g.category === 'clickers'))}
                    </TabsContent>

                    {['basic', 'advanced', 'military', 'quantum'].map((category) => (
                        <TabsContent
                            key={category}
                            value={category}
                            className="h-full overflow-y-auto"
                        >
                            <div className="mt-4 space-y-2">
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
                                                            {formatNumber(upgrade.cost)} PWR
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
} 