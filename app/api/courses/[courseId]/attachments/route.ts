import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth()
        const {url} = await req.json()

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401})

        const courseOwner = await db.courses.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", {status: 401})

        const attachment = await db.attachments.create({
            data: {
                url: url,
                name: url.split("/").pop(),
                courseId: courseOwner.id
            }
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.error("[COURSE_ID_ATTACHMENTS]", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}