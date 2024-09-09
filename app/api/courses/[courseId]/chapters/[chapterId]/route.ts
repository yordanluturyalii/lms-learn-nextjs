import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(request: Request, {params}: { params: { courseId: string, chapterId: string } }) {
    try {
        const {userId} = auth();
        const {isPublished, ...values} = await request.json();

        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const course = await db.chapters.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values,
            }
        })

        return NextResponse.json(course);
    } catch (error) {
        return new NextResponse(`Internal Server Error: ${error}`, {status: 500});
    }
}