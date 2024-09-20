import {MobileSidebar} from "@/app/(home)/_components/mobile-sidebar";
import {NavbarRoutes} from "@/components/navbar-routes";

export const Navbar = () => {
    return (
        <div className={"p-4 border-b dark:border-b-slate-500 h-full flex items-center bg-white dark:bg-[#030712]"}>
            <MobileSidebar/>
            <NavbarRoutes/>
        </div>
    )
}