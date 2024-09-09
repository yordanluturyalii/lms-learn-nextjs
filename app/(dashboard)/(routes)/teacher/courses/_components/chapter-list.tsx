"use client"

import {Chapters} from "@prisma/client";
import {useEffect, useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";;
import {cn} from "@/lib/utils";
import {Grip, Pencil} from "lucide-react";
import {Badge} from "@/components/ui/badge";

interface ChapterListProps {
    items: Chapters[];
    onReorder: (updateData: {id: string, position: number}[]) => void;
    onEdit: (id : string) => void;
}

export const ChapterList = ({items, onReorder, onEdit} : ChapterListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items)
    }, [items]);

    if (!isMounted) return null;

    // @ts-ignore
    // @ts-ignore
    return (
        <DragDropContext onDragEnd={(result : DropResult) => {
            if (!result.destination) return;
            const items = Array.from(chapters);
            const [reorderItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderItem);

            const startIndex = Math.min(result.source.index, result.destination.index);
            const endIndex = Math.max(result.source.index, result.destination.index);

            const updatedChapters = items.slice(startIndex, endIndex + 1);
            setChapters(items);

            const bulkUpdateData = updatedChapters.map((chapter) => ({
                id: chapter.id,
                position: items.findIndex(item => item.id == chapter.id)
            }));

            onReorder(bulkUpdateData);
        }} >
            <Droppable droppableId={"chapters"} >
                {
                    (provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                chapters.map((chapter, index) => (
                                    <Draggable draggableId={chapter.id} index={index} key={chapter.id} >
                                        {(provided) => (
                                            <div className={cn(
                                                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                                chapter.isPublished && "bg-sky-100 text-sky-700 border-sky-200"
                                            )} ref={provided.innerRef} {...provided.draggableProps}>
                                                <div className={cn(
                                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                    chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                                )} {...provided.dragHandleProps}>
                                                    <Grip className={"w-5 h-5 "}/>
                                                </div>
                                                {chapter.title}
                                                <div className={"ml-auto pr-2 flex items-center gap-x-2"}>
                                                    {chapter.isFree && (
                                                        <Badge >
                                                            Free
                                                        </Badge>
                                                    )}
                                                    <Badge className={cn(
                                                        "bg-slate-500",
                                                        chapter.isPublished && "bg-sky-700"
                                                    )}>
                                                        {chapter.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <Pencil onClick={() => onEdit(chapter.id)} className={"h-4 w-4 cursor-pointer hover:opacity-75 transition"} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    )
}