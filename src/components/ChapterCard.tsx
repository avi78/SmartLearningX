import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = { triggerLoad: () => void };

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const { toast } = useToast();
    const [success, setSuccess] = React.useState<boolean | null>(null);
    const { mutate: getChapterInfo, isPending } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet;
      }
    }, [chapter, addChapterIdToSet]);

    React.useImperativeHandle(
      ref,
      () => ({
        async triggerLoad() {
          if (chapter.videoId) {
            addChapterIdToSet();
            return;
          }

          let retryCount = 0;
          const MAX_RETRIES = 5;

          const fetchChapterInfo = async () => {
            try {
              const response = await getChapterInfo();
              setSuccess(true);
              addChapterIdToSet();
            } catch (error) {
              console.error(error);
              setSuccess(false);
              toast({
                title: "Error",
                description: "There was an error loading your chapter",
                variant: "destructive",
              });
              addChapterIdToSet();

              if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(fetchChapterInfo, 1000); // Retry after 2 seconds
              } else {
                console.error("Maximum retries reached. Giving up.");
              }
            }
          };

          fetchChapterInfo();
        },
      }),
      [chapter, addChapterIdToSet, getChapterInfo, toast]
    );

    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {isPending && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;