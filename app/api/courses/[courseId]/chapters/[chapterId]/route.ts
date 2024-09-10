import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import Mux from "@mux/mux-node"

const {video} = new Mux({
    tokenId: process.env["MUX_TOKEN_ID"]!,
    tokenSecret: process.env["MUX_TOKEN_SECRET"]!
});

export async function DELETE(request: Request, {params}: {params: {courseId: string, chapterId: string}}) {
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

        const chapter = await db.chapters.findFirst({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        if (!chapter) return new NextResponse("Not Found", {status: 404});

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }

        const deletedChapter = await db.chapters.delete({
            where: {
                id: params.chapterId,
            }
        });       

        const publishedChaptersInCourse = await db.chapters.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.courses.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse(`Internal Error ${error}`, {status: 500});
    }
}

export async function PATCH(request: Request, {params}: { params: { courseId: string, chapterId: string } }) {
    try {
        const {userId} = auth();
        const {isPublished, ...values} = await request.json();

        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const chapter = await db.chapters.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values,
            }
        })

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const assets = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: assets.id,
                    playbackId: assets.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter);
    } catch (error) {
        return new NextResponse(`Internal Server Error: ${error}`, {status: 500});
    }
}