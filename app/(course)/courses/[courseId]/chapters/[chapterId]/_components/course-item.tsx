"use client"

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, LockOpen, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseItemProps {
    label: string;
    id: string;
    isCompleted?: boolean;
    courseId: string;
    isLocked: boolean,
    isFree: boolean
}

export const CourseItem = ({
    label, id, isCompleted, courseId, isLocked, isFree
}: CourseItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isFree ? CheckCircle : LockOpen);
    const isActive = pathname?.includes(id)

    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className={cn(
            "text-accent-fg group focus:outline-none focus-visible:bg-primary/80 focus-visible:text-primary-fg flex items-center justify-between rounded-md py-2 pl-3 pr-1.5 text-sm font-medium leading-6 tracking-tighter my-1 hover:bg-[#0A57CA] hover:text-white cursor-pointer",
            isActive && "text-white bg-[#0d6dfc]",
        )} 
        onClick={onClick}
        >
            <div className="w-full flex justify-between gap-x-2">
                {label}
                <Icon size={22} className="w-3 dark:text-slate-200"/>
            </div>
        </div>
    )
}