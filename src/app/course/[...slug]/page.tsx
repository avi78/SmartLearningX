import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/QuizCards";
import { prisma } from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async ({ params: { slug } }: Props) => {
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });
  if (!course) {
    return redirect("/gallery");
  }
  let unitIndex = parseInt(unitIndexParam);
  let chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/gallery");
  }
  const chapter = unit.chapters[chapterIndex];
  if (!chapter) {
    return redirect("/gallery");
  }
  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <CourseSideBar course={course} currentChapterId={chapter.id} />
      <div>
        <div className="ml-[400px] px-8">
          <div className="flex">
            <MainVideoSummary
              chapter={chapter}
              chapterIndex={chapterIndex}
              unit={unit}
              unitIndex={unitIndex}
            />
            <QuizCards chapter={chapter} />
          </div>

          <div className="flex-[1] h-[1px] mt-4 bg-gray-300 dark:bg-gray-700" />
          <div className="flex pb-8">
            {prevChapter && (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
                className="flex mt-4 mr-auto w-fit"
              >
                <div className="flex items-center">
                  <ChevronLeft className="w-6 h-6 mr-1 text-gray-600 dark:text-gray-400" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Previous
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {prevChapter.name}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {nextChapter && (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
                className="flex mt-4 ml-auto w-fit"
              >
                <div className="flex items-center">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Next
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {nextChapter.name}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 ml-1 text-gray-600 dark:text-gray-400" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/*<ChatComponent courseId={course.id} courseName={course.name} />*/}
      <Link
        href="/chat"
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white rounded-full p-4 hover:bg-blue-600 transition-colors shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.73-.563A12.666 12.666 0 0018.61 2H7.121c-.379 0-.741.096-1.052.269-.323.18-.64.459-.92.814a2.127 2.127 0 00-.268 1.116v12.534c0 .29.092.567.268.814.28.355.597.634.92.814.311.173.673.269 1.052.269h6.97l5.475 3.693V11.19c.34-.02.68-.045 1.02-.072a2.09 2.09 0 001.549-1.051c.234-.363.372-.79.372-1.242v-4.286c0-.452-.138-.879-.372-1.242z"
          />
        </svg>
      </Link>
    </div>
  );
};

export default CoursePage;