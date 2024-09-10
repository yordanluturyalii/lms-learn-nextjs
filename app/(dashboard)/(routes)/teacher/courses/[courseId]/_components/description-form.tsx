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
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Courses} from "@prisma/client";

interface DescriptionFormProps {
    initialData: Courses,
    courseId: string
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required"
    })
})

export const DescriptionForm = ({initialData, courseId}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
            <div className={"font-medium flex items-center justify-between"}>
                Course Description
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className={"h-4 w-4 mr-2"}/>
                                Edit Description
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                        {initialData.description || "No description"}
                    </p>
                )
            }
            {
                isEditing && (
                    <Form {...form}>
                        <form className={"space-y-4 mt-4"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name={"description"} render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea disabled={isSubmitting} placeholder={"e.g 'Web Development'"} {...field} className={"bg-white"}/>
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