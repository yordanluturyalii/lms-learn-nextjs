"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { StepBack, StepForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import toast from "react-hot-toast";

interface CoursePrevNextButtonProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  prevChapterId?: string;
  isCompleted?: boolean;
}

export const CoursePrevNextButton = ({
  courseId,
  chapterId,
  nextChapterId,
  prevChapterId,
  isCompleted
}: CoursePrevNextButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const prevButtonId = useId();
  const nextButtonId = useId();

  const onClickNext = async () => {
    try {
      setIsLoading(true);

      // Update progress only if the course is not completed
      if (!isCompleted) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true
        });

        // Show confetti if there's no next chapter and course is now completed
        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress Updated");
      }

      // Move to the next chapter if available
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const onClickPrev = () => {
    if (prevChapterId) {
      router.push(`/courses/${courseId}/chapters/${prevChapterId}`);
    }
  };


  return (
    <div className="flex space-x-3">
      {prevChapterId && (
        <Button
          id={prevButtonId}
          onClick={onClickPrev}
          disabled={isLoading}
          type="button"
          variant="ghost"
          className="w-full md:w-auto border border-slate-500"
        >
          <StepBack className="h-4 w-4" />
        </Button>
      )}
      {nextChapterId && (
        <Button
          id={nextButtonId}
          onClick={onClickNext}
          disabled={isLoading}
          type="button"
          variant="ghost"
          className="w-full md:w-auto border border-slate-500"

        >
          <StepForward className="h-4 w-4" />
        </Button>
      )}
      {
        !nextChapterId && (
          <Button
            id={nextButtonId}
            onClick={onClickNext}
            disabled={isLoading}
            type="button"
            variant="ghost"
            className="w-full md:w-auto border border-slate-500"

          >
            Finish
          </Button>
        )
      }
    </div>
  )
}