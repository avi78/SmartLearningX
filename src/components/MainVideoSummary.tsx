"use client";
import { Chapter, Unit } from "@prisma/client";
import axios from "axios";
import { Speech } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

const MainVideoSummary = ({
  unitIndex,
  chapter,
  chapterIndex,
}: Props) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  

  const handleSpeechButtonClick = async () => {
    try {
      const response = await axios.post("http://localhost:5000/tts", {
        text: chapter.summary,
      }, {
        responseType: 'blob',
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-[2] mt-16">
      <h4 className="text-sm uppercase text-secondary-foreground/60">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="text-4xl font-bold">{chapter.name}</h1>
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video max-h-[96rem]"
        src={`https://www.youtube.com/embed/${chapter.videoId}`}
        allowFullScreen
      />
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-semibold">Summary</h3>
          <button
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded"
            onClick={handleSpeechButtonClick}
          >
            <Speech className="h-6 w-6 mr-1" /> Play Summary
          </button>
        </div>
        <p className="mt-2 text-secondary-foreground/80">{chapter.summary}</p>
        {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
      </div>
    </div>
  );
};

export default MainVideoSummary;