"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";
import { ModeToggle } from "./mode-toggle";
import { Logo } from "@/app/(home)/_components/logo";

export const NavbarRoutes = () => {

    const { userId } = useAuth();
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {
                isSearchPage && (
                    <div className={"hidden md:block"}>
                        <SearchInput

                        />
                    </div>
                )
            }
            {
                isCoursePage && (
                    <div>
                        <Logo />
                    </div>
                )
            }
            <div className="flex gap-x-4 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href={"/home"}>
                        <Button size={"sm"} variant={"ghost"}>
                            <LogOut className={"h-4 w-4 mr-2"} />
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? (
                    <Link href={"/teacher/courses"}>
                        <Button size={"sm"} variant={"ghost"}>
                            Teacher Mode
                        </Button>
                    </Link>
                ) : null}
                <ModeToggle />
                <div className="pr-6">
                    <UserButton />
                </div>
            </div>
        </>
    )
}