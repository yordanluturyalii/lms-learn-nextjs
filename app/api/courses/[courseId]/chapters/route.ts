import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req : Request, {params} : {params : { courseId: string }}) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401});

        const courseOwner = await db.courses.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", {status: 401})

        const lastChapter = await db.chapters.findFirst({
            where: {
                courseId: params.courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapters.create({
            data: {
                title,
                courseId: courseOwner.id,
                position: newPosition
            }
        })

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTER]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}