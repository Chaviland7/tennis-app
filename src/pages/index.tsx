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

const Home: NextPage = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const keywords: string[] = ["highlights", "federer", "nadal", "djokovic"];

  if (!videoId) {
    const keywordNumToUse = Math.floor(Math.random() * 4);

    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${env.YOUTUBE_API_KEY}`,
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
      .catch((e) => console.log(e));
  }

  return videoId ? (
    <>
      <Head>
        <title>Luke.Tennis</title>
        <meta name="description" content="Random Tennis Videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <iframe
          className="h-screen w-screen"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </main>
    </>
  ) : null;
};

export default Home;
