import { db } from "@/lib/db";

export const getProgress = async(userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapter = await db.chapters.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }, 
            select: {
                id: true
            }
        });

        const publishChapterIds = publishedChapter.map((chapter) => chapter.id);
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishChapterIds
                },
                isCompleted: true
            }
        })

        const progressPercentage =  (validCompletedChapters / publishChapterIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}