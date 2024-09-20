import {Icon, LucideIcon} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon,
  label: string,
  href: string
}
export const SidebarItem = ({icon: Icon, label, href}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = (pathname == '/' && href == '/') ||
      pathname == href || pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  }
  
  return (
      <button type={"button"} onClick={onClick}
              className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 dark:text-white",
                  isActive && "text-[#0d6dfc] bg-sky-200/20 hover:text-[#0d6dfc] hover:bg-sky-200/20")}>
        <div className={"flex items-center gap-x-2 py-4"}>
            <Icon size={22} className={cn("text-slate-500", isActive && "text-[#0d6dfc]")} />
            {label}
        </div>
          <div className={cn("ml-auto opacity-0 border-2 h-full transition-all border-[#0d6dfc]",
              isActive && "opacity-100")}>
          </div>
      </button>
  )
}