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
            }
        });

        if (!course) return new NextResponse("Not Found", {status: 404});

        const unpublishedCourse = await db.courses.update({
            where: {
                id: params.courseId,
                userId: userId
            }, 
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}