import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import Mux from "@mux/mux-node";
import { isTeacher } from "@/lib/teacher";

const {video} = new Mux({
    tokenId: process.env["MUX_TOKEN_ID"]!,
    tokenSecret: process.env["MUX_TOKEN_SECRET"]!
});

export async function DELETE(request: Request, {params}: { params: { courseId: string } }) {
    try {
        const {userId} = auth();

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401});

        const courseOwner = await db.courses.findUnique({
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
        })

        if (!courseOwner) return new NextResponse("Not Found", {status: 404});

        for (const chapter of courseOwner.chapters) {
            if (chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId)
            }
        }

        const deletedCourse = await db.courses.delete({
            where: {
                id: params.courseId,
            }
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        return new NextResponse(`Internal Server Error: ${error}`, {status: 500});
    }
}

export async function PATCH(request: Request, {params}: { params: { courseId: string } }) {
    try {
        const {userId} = auth();
        const values = await request.json();

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401});

        const course = await db.courses.update({
            where: {
                id: params.courseId,
                userId
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