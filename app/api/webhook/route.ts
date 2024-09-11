import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe"

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = Stripe.webhooks.constructEvent(
            body, 
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse("Webhook error: Missing metadata", {status: 400});
        }

        await db.purchases.create({
            data: {
                courseId: courseId,
                userId: userId
            }
        });
    } else {
        return new NextResponse(`Webhook error: Unhandled event type ${event.type}`, {status: 400});
    }

    return new NextResponse(null, {status: 200});

}