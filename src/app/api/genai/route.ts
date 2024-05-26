import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
//import { ChromaClient } from "chromadb";
//import {QdrantClient} from '@qdrant/qdrant-js'; // REST client
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    const prompt = reqBody.data.prompt;
    const course = await prisma.course.findFirst();
  const courseName = course?.name;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
        model: "gemini-pro",
      });
      const streamingResponse = await model.generateContentStream(prompt);
      return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}