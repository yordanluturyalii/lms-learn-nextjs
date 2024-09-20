import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File, Link } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CourseItem } from "./_components/course-item";

const ChapterIdPage = async ({ params }: {
    params: { courseId: string, chapterId: string }
}) => {

    const { userId } = auth();

    if (!userId) return redirect("/home");

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase
    } = await getChapter({
        userId: userId, courseId: params.courseId, chapterId: params.chapterId
    });

    const totalChapters = await db.chapters.findMany({
        where: {
            courseId: params.courseId
        }
    });

    if (!chapter || !course) return redirect("/home");

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div className="w-full">
            {
                userProgress?.isCompleted && (
                    <Banner label="You already completed this chapter" variant={"success"} />
                )
            }
            <div className="mx-auto mt-3 max-w-screen-2xl lg:mt-10 lg:px-8 overflow-x-hidden">
                <div className="flex flex-col lg:flex-row lg:gap-x-10">
                    <div className="hidden w-1/4 shrink-0 lg:block">
                        <div role="list" className="sticky flex flex-col gap-y-4">
                            <div className="relative z-10 overflow-hidden p-px">
                                <div className="relative ring-1 ring-foreground/10 bg-[#0D0D0F]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="justd-icons transitions-color absolute z-20 size-4 text-fg duration-300 -right-1.5 -top-1.5 -rotate-45 skyhp9p7cy" data-slot="icon" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 4 8 8-8 8"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="justd-icons transitions-color absolute z-20 size-4 text-fg duration-300 -left-1.5 -top-1.5 rotate-45 skyhp9p7cy" data-slot="icon" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15 20-8-8 8-8"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="justd-icons transitions-color absolute z-20 size-4 text-fg duration-300 -bottom-1.5 -right-1.5 rotate-45 skyhp9p7cy" data-slot="icon" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 4 8 8-8 8"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="justd-icons transitions-color absolute z-20 size-4 text-fg duration-300 -bottom-1.5 -left-1.5 -rotate-45 skyhp9p7cy" data-slot="icon" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15 20-8-8 8-8"></path></svg>
                                    <span className="space-y-2 p-4">
                                        <div className="font-semibold">
                                            {course.title}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                {chapter.title}
                                            </span>
                                            <span>
                                                {course.category?.name}
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className="pr-5">
                                <div className="max-h-[38rem] [&::-webkit-scrollbar]:w-1 [scrollbar-width:thin] mx-0 overflow-y-auto space-y-1 focus:outline-none">
                                    {
                                        course.chapters.map((chapter) => (
                                            <CourseItem
                                                key={chapter.id}
                                                label={chapter.title}
                                                id={chapter.id}
                                                courseId={params.courseId}
                                                isLocked={!chapter.isFree && !purchase}
                                                isFree={chapter.isFree}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <main className="w-full lg:w-2/3 overflow-x-hidden">
                        <div className="flex flex-col gap-y-4 lg:mt-0 lg:gap-y-6 overflow-x-hidden">
                            <VideoPlayer
                                chapterId={params.chapterId}
                                title={chapter.title}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                playbackId={muxData?.playbackId!}
                                isLocked={isLocked}
                                completeOnEnd={completeOnEnd}
                            />
                            <div className="border dark:border-slate-700 border-slate-300">
                                <div className=""></div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage;