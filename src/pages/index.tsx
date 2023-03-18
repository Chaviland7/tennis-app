import axios from "axios";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { env } from "../env.mjs";

interface YoutubeApiResponseData {
  id: {
    videoId: string;
  };
}
interface YoutubeApiResponse {
  data: {
    items: YoutubeApiResponseData[];
  };
}

interface specificError {
  reason: string;
}

interface generalError {
  response: {
    data: {
      error: {
        code: number;
        errors: specificError[];
      };
    };
  };
}

const Home: NextPage = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const keywords: string[] = ["highlights", "federer", "nadal", "djokovic"];

  if (!videoId) {
    const keywordNumToUse = Math.floor(Math.random() * 4);

    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {
          params: {
            videoEmbeddable: true,
            channelId: "UCbcxFkd6B9xUU54InHv4Tig",
            type: "video",
            maxResults: 50,
            q: keywords[keywordNumToUse],
          },
        }
      )
      .then((response: YoutubeApiResponse) => {
        const resultNumToUse = Math.floor(Math.random() * 50);
        setVideoId(
          (response.data.items[resultNumToUse] as YoutubeApiResponseData).id
            .videoId
        );
      })
      .catch((e: generalError) => {
        console.log(e);
        if (
          e.response.data?.error?.code === 403 &&
          e.response.data.error.errors.some((e) => e.reason === "quotaExceeded")
        ) {
          alert(
            "The YouTube API cut ya off for today. Maybe time to go outside..."
          );
        }
      });
  }

  return (
    <>
      <Head>
        <title>Luke.Tennis</title>
        <meta name="description" content="Random Tennis Videos" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        {videoId ? (
          <iframe
            className="h-screen w-screen"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            className="my-0 mx-auto h-screen"
            src="/loading.gif"
            alt="loading"
          />
        )}
      </main>
    </>
  );
};

export default Home;
