"use client"

import * as z from "zod";
import axios from "axios";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormItem, Form, FormControl, FormMessage, FormField} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Courses} from "@prisma/client";
import {Combobox} from "@/components/ui/combobox";

interface CategoryFormProps {
    initialData: Courses,
    courseId: string,
    options: {
        label: string,
        value: string
    }[]
}

const formSchema = z.object({
    categoryId: z.string().min(1)
})

export const CategoryForm = ({initialData, courseId, options}: CategoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
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

    const selectedOption = options.find((option: any) => option.value === initialData.categoryId);

    return (
        <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
            <div className={"font-medium flex items-center justify-between"}>
                Course Category
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className={"h-4 w-4 mr-2"}/>
                                Edit Category
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.categoryId && "text-slate-500 italic"
                    )}>
                        {selectedOption?.label || "No Category"}
                    </p>
                )
            }
            {
                isEditing && (
                    <Form {...form}>
                        <form className={"space-y-4 mt-4"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name={"categoryId"} render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox options={options} {...field} />
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