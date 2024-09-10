import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const {userId} = auth();
        
        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const course = await db.courses.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) return new NextResponse("Not Found", {status: 404});

        const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required Field", { status: 400 });
        }

        const publishedCourse = await db.courses.update({
            where: {
                id: params.courseId,
                userId: userId
            }, 
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}