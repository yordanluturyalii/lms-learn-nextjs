import { db } from "@/lib/db";
import { Attachments, Chapters } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string
}

export const getChapter = async ({
    userId, courseId, chapterId
}: GetChapterProps) => {
    try {
        const purchase = await db.purchases.findUnique({
            where: {
                courseId_userId: {
                    userId: userId,
                    courseId: courseId
                },
            }
        });

        const course = await db.courses.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true,
                title: true,
                category: true,
                chapters: true
            },
        });

        const chapter = await db.chapters.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or Course not found");
        }

        let muxData = null;
        let attachments: Attachments[] = [];
        let nextChapter: Chapters | null = null;
        let previousChapter: Chapters | null = null;

        if (purchase) {
            attachments = await db.attachments.findMany({
                where: {
                    courseId: courseId
                }
            })
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            });

            nextChapter = await db.chapters.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })

            previousChapter = await db.chapters.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        lt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "desc",
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId: userId,
                    chapterId: chapterId,
                },
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
            previousChapter
        };

    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
}