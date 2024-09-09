import {MobileSidebar} from "@/app/(dashboard)/_components/mobile-sidebar";
import {NavbarRoutes} from "@/components/navbar-routes";

export const Navbar = () => {
    return (
        <div className={"p-4 border-b h-full flex items-center bg-white"}>
            <MobileSidebar/>
            <NavbarRoutes/>
        </div>
    )
}