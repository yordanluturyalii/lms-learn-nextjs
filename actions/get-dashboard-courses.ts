import { db } from "@/lib/db";
import { Categories, Chapters, Courses } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Courses & {
    category: Categories;
    chapters: Chapters[];
    progress: number | null
}

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

export const  getDashboardCourses = async(userId : string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchases.findMany({
            where: {
                userId: userId,
            }, 
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];
        
        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;

        }

        const completedCourses = courses.filter(course => course.progress === 100);
        const courseInProgress = courses.filter(course => (course.progress ?? 0) < 100);

        return {
            completedCourses, 
            courseInProgress
        }

    } catch (error) {
        console.log("[GET_DASHBOARD]", error);
        return {
            completedCourses: [],
            courseInProgress: []
        }
    }
}