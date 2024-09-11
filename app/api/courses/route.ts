import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";
export async function POST(
    request: Request
) {
    try {
        const {userId} = auth();
        const {title} = await request.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.courses.create({
            data: {
                userId, title
            }
        })

        return NextResponse.json(course);
    } catch (error) {
        return new NextResponse(`Internal Error: ${error}`, {status: 500});
    }
}