// api/course/createChapters.ts
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gemini";
import { getUnsplashImage } from "@/lib/unsplash";
import { createChaptersSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { title, units } = createChaptersSchema.parse(body);

        type outputUnits = {
            title: string;
            chapters: {
                youtube_search_query: string;
                chapter_title: string;
            }[];
        }[];

        const userPrompts = units.map(
            (unit) => `It is your job to create a chapter about ${unit} for the course "${title}". Provide a detailed YouTube search query that can be used to find an informative educational video for this chapter. The query should give an educational informative course in English on YouTube.`
        );

        let output_units: outputUnits = await strict_output(
            "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant YouTube videos for each chapter",
            userPrompts,
            {
                title: "title of the unit",
                chapters: "an array of chapters, each chapter should have a youtube_search_query (in the search query please append -in English in the end to get only english videos )and a chapter_title key in the JSON object",
            }
        );

        const imageSearchTerm = await strict_output(
            "you are an AI capable of finding the most relevant image for a course",
            `Please provide a good image search term in one to two words only for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results.Make sure the search term is simple for the unsplash API yet effective`,
            {
              image_search_term: "a good search term for the title of the course",
            }
        );
      
        const course_image = await getUnsplashImage(
            imageSearchTerm.image_search_term
          );
        const course = await prisma.course.create({
        data: {
            name: title,
            image: course_image,
              },
        });

        for (const unit of output_units) {
            const title = unit.title;
            const prismaUnit = await prisma.unit.create({
              data: {
                name: title,
                courseId: course.id,
              },
            });
        await prisma.chapter.createMany({
            data: unit.chapters.map((chapter) => {
                return {
                name: chapter.chapter_title,
                youtubeSearchQuery: chapter.youtube_search_query,
                unitId: prismaUnit.id,
                };
            }),
            });
        }


        
        console.log(output_units);
        return NextResponse.json({course_id: course.id});

    } catch (error) {
        if (error instanceof ZodError) {
            return new NextResponse("invalid body", { status: 400 });
        } else {
            console.error(error);
            return new NextResponse("internal server error", { status: 500 });
        }
    }
}
