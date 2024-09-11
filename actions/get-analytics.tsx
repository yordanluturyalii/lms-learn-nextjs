import { db } from "@/lib/db";
import { Courses, Purchases } from "@prisma/client"
import { NextResponse } from "next/server";

type PurchaseWithCourse = Purchases & {
    course: Courses;
};

const groupByCourse = (purchases : PurchaseWithCourse[]) => {
    const grouped: {[courseTitle: string]: number} = {};

    purchases.forEach(purchase => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) grouped[courseTitle] = 0;

        grouped[courseTitle] += purchase.course.price!;
    });

    return grouped;
}

export const getAnalytics = async(userId : string): Promise<any> => {
    try {
        const purchases = await db.purchases.findMany({
            where: {
                course: {
                    userId: userId,
                }
            }, 
            include: {
                course: true
            }
        })
        
        const groupedEarnings = groupByCourse(purchases);

        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total
        }));

        const totalRevenue = data.reduce((acc, cur) => acc + cur.total, 0);
        const totalSales = purchases.length;

        return {
            data, 
            totalRevenue, 
            totalSales
        };
    } catch (error) {
        console.log("[GET_ANALYTICS]", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}