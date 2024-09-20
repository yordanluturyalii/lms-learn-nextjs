import React from "react";
import { Sidebar } from "@/app/(home)/_components/sidebar";
import { Navbar } from "@/app/(home)/_components/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={"h-full"}>
        <div className={"h-[80px] md:pl-56 fixed inset-y-0 w-full z-50"}>
          <Navbar />
        </div>
        <div className={"hidden h-full w-56 fixed inset-y-0 z-50 md:flex flex-col"}>
          <Sidebar />
        </div>
        <main className="md:pl-56 pt-[80px] h-full">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default HomeLayout;