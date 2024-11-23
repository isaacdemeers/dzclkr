import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UpgradeCardProps {
    title: string
    description: string
    cost: number
    type: string
}

export function UpgradeCard({ title, description, cost, type }: UpgradeCardProps) {
    return (
        <Card className="w-[250px] h-[200px] bg-card hover:bg-card/90 transition-colors border-2 border-primary/20">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-military">{title}</CardTitle>
                    <Badge variant="outline" className="bg-primary/10">
                        {cost} pts
                    </Badge>
                </div>
                <Badge variant="secondary" className="w-fit">
                    {type}
                </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <CardDescription className="text-sm">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    )
} 