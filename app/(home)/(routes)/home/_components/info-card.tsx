import { IconBadge } from "@/components/icon-badge"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface InfoCardProps {
    icon: LucideIcon;
    label: string
    numberOfItems: number
    variant?: "default" | "success"
}

export const InfoCard = ({variant, label, numberOfItems, icon : Icon}: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3 dark:bg-[#09090b] dark:border-slate-500">
            <IconBadge
                variant={variant}
                icon={Icon}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-sm text-gray-100">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}