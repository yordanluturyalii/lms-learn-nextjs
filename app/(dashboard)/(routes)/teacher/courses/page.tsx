import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


async function CoursesPage() {

    const {userId} = auth();
    
    if (!userId) return redirect('/');

    const courses = await db.courses.findMany({
        where: {
            userId: userId
        }, 
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className={'p-6'}>
            <DataTable columns={columns} data={courses} />
        </div>
    )
}

export default CoursesPage;