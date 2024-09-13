"use client"

import * as z from "zod";
import axios from "axios";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Courses} from "@prisma/client";
import Image from "next/image";
import {FileUpload} from "@/components/file-upload";

interface ImageFormProps {
    initialData: Courses,
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    })
})

export const ImageForm = ({initialData, courseId}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || ""
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error(`Something went wrong ${error}`);
        }
    }

    return (
        <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
            <div className={"font-medium flex items-center justify-between"}>
                Course Image
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing && (
                            <>Cancel</>
                        )
                    }
                    {!isEditing && !initialData?.imageUrl && (
                        <>
                            <PlusCircle
                                className={"w-4 h-4 mr-2"}
                            />
                            Add Image
                        </>
                    )}
                    { !isEditing && initialData?.imageUrl &&
                        (
                            <>
                                <Pencil className={"h-4 w-4 mr-2"}/>
                                Edit Image
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    !initialData?.imageUrl ? (
                        <div className={"flex items-center justify-center h-60 bg-slate-200 rounded-md"}>
                            <ImageIcon className={"h-10 w-10 text-slate-500"} />
                        </div>
                    ) : (
                        <div className={"relative aspect-video mt-2"}>
                            <Image src={initialData?.imageUrl} alt={"Upload"} fill className={"object-cover rounded-md"} />
                        </div>
                    )
                )
            }
            {
                isEditing && (
                    <div>
                        <FileUpload onChange={(url) => {
                            if (url) onSubmit({imageUrl: url})
                        }} endpoint={"courseImage"} />
                        <div className={"text-xs text-muted-foreground mt-4"}>
                            16:9 aspect ration recommended
                        </div>
                    </div>
                )
            }
        </div>
    )
}