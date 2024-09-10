import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const {userId} = auth();
        
        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const courseOwner = await db.courses.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) return new NextResponse("Unauthorized", {status: 401});

        const unpublishedChapter = await db.chapters.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false
            }
        });

        const publishedChapterInCourse = await db.chapters.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            },
        })

        if (!publishedChapterInCourse.length) {
            await db.courses.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}