"use client"

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"

export const SearchInput = () => {

    const [value, setValue] = useState("");
    const debounceValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query:{
                categoryId: currentCategoryId,
                title: debounceValue 
            }
        }, {skipEmptyString: true, skipNull: true})

        router.push(url);
    }, [debounceValue, currentCategoryId, router, pathname])

    return (
        <div className={"relative"}>
            <Search 
                className={"h-4 w-4 absolute top-3 left-3 text-slate-600"}
            />
            <Input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                className={"w-full md:w-[300px] pl-9 rounded-full dark:bg-[#030712] bg-slate-100 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-500"}
                placeholder={"Search for a course"}
            />
        </div>
    )
}