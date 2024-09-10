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
import {Courses} from "@prisma/client";
import {formatPrice} from "@/lib/format";

interface PriceFormProps {
    initialData: Courses,
    courseId: string
}

const formSchema = z.object({
    price: z.coerce.number()
})

export const PriceForm = ({initialData, courseId}: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
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
                Course Price
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className={"h-4 w-4 mr-2"}/>
                                Edit Price
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.price && "text-slate-500 italic"
                    )}>
                        {initialData.price ? formatPrice(initialData.price) : "No price"}
                    </p>
                )
            }
            {
                isEditing && (
                    <Form {...form}>
                        <form className={"space-y-4 mt-4"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name={"price"} render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type={"number"} step={0.0} disabled={isSubmitting} placeholder={"Set a price for your course"} {...field} className={"bg-white"}/>
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