import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { IconBadge } from "@/components/icon-badge"

interface CourseCardProps {
    title: string,
    imageUrl: string,
    chaptersLength: number,
    category: string,
}

export const CourseCard = ({title, imageUrl, chaptersLength,category}: CourseCardProps) => {
    return (
        <button className="my-2 z-50">
            <div className={"group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full z-50"}>
                <div className={"relative w-full aspect-video rounded-md overflow-hidden z-50"}>
                    <img 
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className={"flex flex-col pt-2 z-50"}>
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge
                                size={"sm"}
                                icon={BookOpen}
                            />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}