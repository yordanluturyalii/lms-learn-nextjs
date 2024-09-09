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
import {Attachments, Courses} from "@prisma/client";
import Image from "next/image";
import {FileUpload} from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Courses & { attachments: Attachments[] },
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
});

export const AttachmentForm = ({initialData, courseId}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current: boolean) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: initialData?.imageUrl || ""
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
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
                Course Image
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing && (
                            <>Cancel</>
                        )
                    }
                    {!isEditing && (
                        <>
                            <PlusCircle
                                className={"w-4 h-4 mr-2"}
                            />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {
                !isEditing && (
                    <>
                        {initialData.attachment.length === 0 && (
                            <p className={"text-sm mt-2 text-slate-500 italic "}>
                                No attachment yet
                            </p>
                        )}
                    </>
                )
            }
            {
                isEditing && (
                    <div>
                        <FileUpload onChange={(url) => {
                            if (url) onSubmit({url: url})
                        }} endpoint={"courseAttachment"}/>
                        <div className={"text-xs text-muted-foreground mt-4"}>
                            Add anything your students might need to complete the course.
                        </div>
                    </div>
                )
            }
        </div>
    )
}