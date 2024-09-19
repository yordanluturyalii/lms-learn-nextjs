
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Invoice as InvoiceClient, Customer as CustomerClient } from "xendit-node";
import {CreateInvoiceRequest, Invoice} from "xendit-node/invoice/models";

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
        
        const xenditInvoiceClient = new InvoiceClient({secretKey: process.env.XENDIT_API_KEY!});
        const xenditCustomerClient = new CustomerClient({secretKey: process.env.XENDIT_API_KEY!});

        let xenditCustomer = await db.stripeCustomers.findUnique({
            where: {
                userId: user.id,
            }, 
            select: {
                stripeCustomerId: true
            }
        });

        if (!xenditCustomer) {
            const customer = xenditCustomerClient.createCustomer({
                data: {
                    referenceId: user.id,
                    type: "INDIVIDUAL",
                    individualDetail: {
                        givenNames: user.fullName!,
                    },
                    email: user.emailAddresses[0].emailAddress
                }
            });

            await db.stripeCustomers.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: (await customer).id
                }
            })
        }

        const data: CreateInvoiceRequest = {
            amount: course.price!,
            invoiceDuration: "172800",
            externalId: `${randomUUID()}@${course.id}@${user.id}`, 
            description: course.title,
            currency: "IDR",
            reminderTime: 1,
            successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.courseId}?success=1`,
            failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.courseId}?canceled=1`,
        }

        const response: Invoice = await xenditInvoiceClient.createInvoice({
            data,
        });

        return NextResponse.json({url: response.invoiceUrl});
    } catch (error) {
        console.log("[COURSE_CHECKOUT_ID]", error);
        return new NextResponse(`Internal Server Error: ${error}`, {status: 500});
    }
}