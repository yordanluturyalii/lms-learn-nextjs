import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";

const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { courseId: string }
}) => {
    const { userId } = auth();

    if (!userId) return redirect('/home');

    const course = await db.courses.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId: userId
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            },
        }
    });

    if (!course) return redirect('/home');

    const progressCount = await getProgress(userId, course.id);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className={"h-full w-full overflow-x-hidden"}>
                <div className="h-[80px] w-full fixed inset-y-0 z-50">
                    <CourseNavbar
                        course={course}
                        progressCount={progressCount}
                    />
                </div>
                <main className={"pt-[80px] h-full overflow-x-hidden"}>
                    {children}
                </main>
            </div>
        </ThemeProvider>
    )
}

export default CourseLayout;