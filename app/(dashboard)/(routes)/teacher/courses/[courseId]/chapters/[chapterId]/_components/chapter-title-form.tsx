"use client"

import * as z from "zod";
import axios from "axios";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormItem, Form, FormControl, FormMessage, FormField} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

interface ChapterTitleFormProps {
    initialData: {
        title: string
    },
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})

export const ChapterTitleForm = ({initialData, courseId, chapterId}: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
            <div className={"font-medium flex items-center justify-between"}>
                Course Title
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className={"h-4 w-4 mr-2"}/>
                                Edit Title
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={"text-sm mt-2"}>
                        {initialData.title}
                    </p>
                )
            }
            {
                isEditing && (
                    <Form {...form}>
                        <form className={"space-y-4 mt-4"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name={"title"} render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={"e.g 'Introduction to the course'"} {...field} className={"bg-white"}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className={"flex items-center gap-x-2"}>
                                <Button disabled={!isValid || isSubmitting} type={"submit"}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}