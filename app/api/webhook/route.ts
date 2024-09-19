import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const hook = await request.json();

    const userId = hook.external_id.split("@")[2];
    const courseId = hook.external_id.split("@")[1];

    console.log(userId, courseId);

    if (hook.status === "PAID") {
        if (!userId || !courseId) return new NextResponse("Webhook Error: Missing Metadata", {status: 400});   
        
        await db.purchases.create({
            data: {
                userId,
                courseId,
            }
        })
    } else {
        return new NextResponse("Not Implemented", {status: 500});
    }

}