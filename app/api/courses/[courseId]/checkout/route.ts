
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { url } from "inspector";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req : Request, {params}:{params: {courseId: string}}) {
    try {
        const user = await currentUser();
        
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.courses.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            },
        })

        const purchase = await db.purchases.findUnique({
            where: {
                courseId_userId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if (purchase) {
            return new NextResponse("Already Purchase", {status: 400});
        }

        if (!course) {
            return new NextResponse("Not Found", {status: 404});
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "IDR",
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomers.findUnique({
            where: {
                userId: user.id,
            }, 
            select: {
                stripeCustomerId: true
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            });

            stripeCustomer = await db.stripeCustomers.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        })

        return NextResponse.json({url: session.url})
    } catch (error) {
        console.log("[COURSE_CHECKOUT_ID]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}