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
        <div className="p-4 border-b w-full h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    )
}