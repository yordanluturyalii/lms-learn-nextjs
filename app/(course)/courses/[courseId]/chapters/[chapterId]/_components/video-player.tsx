"use client"

import { useConfettiStore } from "@/hooks/use-confetti-store"
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CourseEnrollButton } from "./course-enroll-button";

interface VideoPlayerProps {
    playbackId: string;
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string,
    price: number
}

export const VideoPlayer = ({ playbackId, chapterId, courseId, nextChapterId, isLocked, completeOnEnd, title, price }: VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnded = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                })
            }

            if (!nextChapterId) {
                confetti.onOpen();
            }

            toast.success("Progress Updated");
            router.refresh();

            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="relative aspect-video max-w-full">
            {
                !isReady && !isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 border dark:border-slate-700 border-slate-300 rounded-md ">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    </div>
                )
            }
            {
                isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col bg-slate-800 text-white space-y-2 border dark:border-slate-700 border-slate-300 rounded-md ">
                        <Lock className="h-8 w-8" />
                        <p className="text-sm text-muted-foreground">
                            This chapter is locked
                        </p>
                        <CourseEnrollButton courseId={courseId} price={price} />
                    </div>
                )
            }
            {
                !isLocked && (
                    <MuxPlayer
                        title={title}
                        className={cn(
                            "border dark:border-slate-700 border-slate-300 rounded-md ",
                            !isReady && "hidden"
                        )}
                        onCanPlay={() => setIsReady(true)}
                        onEnded={onEnded}
                        playbackId={playbackId}
                    />
                )
            }
        </div>
    )
}