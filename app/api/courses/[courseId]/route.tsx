import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(request: Request, {params}: { params: { courseId: string } }) {
    try {
        const {userId} = auth();
        const values = await request.json();

        if (!userId) return new NextResponse("Unauthorized", {status: 401});

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