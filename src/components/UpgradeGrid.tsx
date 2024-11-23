import { UpgradeCard } from "./UpgradeCard"

export function UpgradeGrid({ upgrades }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {upgrades.map((upgrade) => (
                <UpgradeCard
                    key={upgrade.id}
                    title={upgrade.title}
                    description={upgrade.description}
                    cost={upgrade.cost}
                    type={upgrade.type}
                />
            ))}
        </div>
    )
} 