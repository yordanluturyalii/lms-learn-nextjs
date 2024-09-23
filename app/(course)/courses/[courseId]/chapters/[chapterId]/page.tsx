import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { Preview } from "@/components/preview";
import { File, StepBack, StepForward } from "lucide-react";
import { db } from "@/lib/db";
import { CourseItem } from "./_components/course-item";
import { CoursePrevNextButton } from "./_components/course-prev-next-button";
import { Separator } from "@/components/ui/separator";

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
        previousChapter,
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
            <div className="mx-auto mt-3 max-w-screen-2xl lg:mt-16 lg:px-8 overflow-x-hidden">
                <div className="flex flex-col lg:flex-row lg:gap-x-16">
                    <div className="hidden w-1/4 shrink-0 lg:block">
                        <div role="list" className="sticky flex flex-col gap-y-4">
                            <div className="relative z-10 overflow-hidden p-px">
                                <div className="relative ring-1 ring-foreground/10 px-4 dark:bg-[#0d0d0f]">
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
                            <div className="">
                                <div className="max-h-[38rem] [&::-webkit-scrollbar]:w-1 [scrollbar-width:thin] overflow-y-auto space-y-1 focus:outline-none">
                                    {
                                        course.chapters.map((chapter) => (
                                            <CourseItem
                                                key={chapter.id}
                                                label={chapter.title}
                                                id={chapter.id}
                                                courseId={params.courseId}
                                                isLocked={isLocked}
                                                isCompleted={!!userProgress?.isCompleted}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <main className="w-full lg:w-2/3 overflow-x-hidden">
                        <div className="flex flex-col gap-y-4 lg:mt-0 lg:gap-y-6 overflow-x-hidden px-4">
                            <VideoPlayer
                                chapterId={params.chapterId}
                                title={chapter.title}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                playbackId={muxData?.playbackId!}
                                isLocked={isLocked}
                                completeOnEnd={completeOnEnd}
                                price={course.price!}
                            />
                            <div className="border dark:border-slate-700 border-slate-300 rounded-md flex justify-between p-4">
                                <div className="w-full">
                                    <div className="font-bold mx-2 text-2xl">
                                        {course.title}
                                    </div>
                                    <Preview value={chapter.description!} />
                                    <Separator className="w-full" />
                                    <div className="my-4">
                                        {attachments.map((attachment) => (
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                key={attachment.id}
                                                className="flex items-center p-3 w-full bg-sky-200 border dark:border-slate-500 text-sky-700 rounded-md hover:underline my-3"
                                            >
                                                <File />
                                                <p className="line-clamp-1">
                                                    {attachment.name}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {
                                        nextChapter || previousChapter ? (
                                            <CoursePrevNextButton
                                                courseId={params.courseId}
                                                nextChapterId={nextChapter?.id}
                                                prevChapterId={previousChapter?.id}
                                                chapterId={params.chapterId}
                                                isCompleted={!!userProgress?.isCompleted}
                                            />
                                        ) : (
                                            <></>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage;