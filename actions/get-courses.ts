import { db } from "@/lib/db";
import { Categories, Courses } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseProgressWithCategory = Courses & {
    category: Categories | null;
    chapters: {id: string}[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string
};

export const getCourses = async({userId, title, categoryId}: GetCourses): Promise<CourseProgressWithCategory[]> => {
    try {
        const courses = await db.courses.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    }, 
                    select: {
                        id: true
                    }
                }, 
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const courseWithProgress: CourseProgressWithCategory[] = await Promise.all(
            courses.map(async(course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null 
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage
                };
            })
        );

        return courseWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}