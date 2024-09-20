import { Logo } from "@/app/(home)/_components/logo";
import { SidebarRoutes } from "@/app/(home)/_components/sidebar-routes";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const Sidebar = () => {
    return (
        <div className={"h-full border-r dark:dark:border-r-slate-500 flex flex-col overflow-y-auto dark:bg-[#030712] bg-white shadow-sm"}>
            <div className={"p-6"}>
                <Logo />
            </div>
            <div className={"flex flex-col w-full"}>
                <SidebarRoutes />
            </div>
        </div>
    )
}