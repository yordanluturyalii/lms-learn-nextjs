import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapters, Courses, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: Courses & {
        chapters: (Chapters & {
            userProgress: UserProgress[] | null
        })[]
    };
    progressCount: number
}

export const CourseNavbar = ({course, progressCount}: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b dark:border-b-slate-500 w-screen h-full flex items-center bg-white shadow-sm dark:bg-[#030712] px-4">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    )
}