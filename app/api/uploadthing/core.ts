import { createUploadthing, type FileRouter } from "uploadthing/next";
import {auth} from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = () => {
    const {userId} = auth();
    if (!userId) throw new Error("Unauthorized");
    return {userId};
}

export const ourFileRouter = {
    courseImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    courseAttachment: f(["image", "text", "audio", "video", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({video: {maxFileSize: "512GB", maxFileCount: 1}})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;