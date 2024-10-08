"use client"

import * as z from "zod";
import axios from "axios";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormItem, Form, FormControl, FormMessage, FormField} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Loader2, PlusCircle} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Chapters, Courses} from "@prisma/client";
import {Input} from "@/components/ui/input";
import {ChapterList} from "@/app/(home)/(routes)/teacher/courses/[courseId]/_components/chapter-list";

interface ChapterFormProps {
    initialData: Courses & {chapters: Chapters[]};
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Chapter is required"
    })
})

export const ChapterForm = ({initialData, courseId}: ChapterFormProps) => {

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const toggleCreating = () => setIsCreating((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter updated");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onReorder = async (updateData : {id : string, position: number}[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Chapter Reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id : string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className={"relative mt-6 border bg-slate-100 rounded-md p-4"}>
            {isUpdating && (
                <div className={"absolute h-full w-full text-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center"}>
                    <Loader2 className={"animate-spin h-6 w-6 text-sky-700"} />
                </div>
            )}
            <div className={"font-medium flex items-center justify-between"}>
                Course Chapters
                <Button variant={"ghost"} onClick={toggleCreating}>
                    {
                        isCreating ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <PlusCircle className={"h-4 w-4 mr-2"}/>
                                Add a chapter
                            </>
                        )
                    }
                </Button>
            </div>
            {
                isCreating && (
                    <Form {...form}>
                        <form className={"space-y-4 mt-4"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name={"title"} render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting}
                                               placeholder={"e.g 'Introduction To Course'"} {...field}
                                               className={"bg-white"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <Button disabled={!isValid || isSubmitting} type={"submit"}>
                                Create
                            </Button>
                        </form>
                    </Form>
                )
            }
            {
                !isCreating && (
                    <div className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No Chapters"}
                        <ChapterList items={initialData.chapters} onReorder={onReorder} onEdit={onEdit} />
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className={"text-xs text-muted-foreground mt-4"}>
                        Drag & drop to reorder the chapter
                    </p>
                )
            }
        </div>
    )
}