import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/title-form";
import { DescriptionForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/description-form";
import { ImageForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/image-form";
import { CategoryForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/category-form";
import { PriceForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/price-form";
import { AttachmentForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/attachment-form";
import { ChapterForm } from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = auth();

    if (!userId) return redirect("/home");

    const course = await db.courses.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            },
            chapters: {
                orderBy: {
                    position: "asc"
                }
            }
        },
    });

    const categories = await db.categories.findMany({
        orderBy: {
            name: "asc",
        }
    });

    if (!course) return redirect("/home");

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
        {
            !course.isPublished && (
                <Banner
                    label={"This course is unpublished. It will not be invisible to the students."} 
                />
            )
        }
            <div className={"p-6"}>
                <div className={"flex items-center justify-between"}>
                    <div className={"flex flex-col gap-y-2"}>
                        <h1 className={"text-2xl font-medium"}>
                            Course Setup
                        </h1>
                        <span className={"text-sm text-slate-700"}>
                            Completed all fields {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"}>
                    <div>
                        <div className={"flex items-center gap-x-2"}>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className={"text-xl"}>
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm initialData={course} courseId={params.courseId} />
                        <DescriptionForm initialData={course} courseId={params.courseId} />
                        <ImageForm initialData={course} courseId={params.courseId} />
                        <CategoryForm initialData={course} courseId={params.courseId} options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))} />
                    </div>
                    <div className={"space-y-6"}>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={ListChecks} />
                                <h2>
                                    Course Chapter
                                </h2>
                            </div>
                            <ChapterForm initialData={course} courseId={params.courseId} />
                        </div>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className={"text-xl"}>
                                    Sell your course
                                </h2>
                            </div>
                            <div>
                                <PriceForm initialData={course} courseId={params.courseId} />
                            </div>
                        </div>
                        <div>
                            <div className={"flex items-center gap-x-2"}>
                                <IconBadge icon={File} />
                                <h2 className={"text-xl"}>
                                    Resource & Attachment
                                </h2>
                            </div>
                            <div>
                                <AttachmentForm initialData={course} courseId={params.courseId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseIdPage;