/* eslint-disable @next/next/no-img-element */
import { memo, ReactNode, useState } from "react";
import { useQuery } from "react-query";
import youtubeService from "src/services/youtubeService";
import { VideoInfo } from "src/types/video";

type Props = {
  url: string;
};

function VideoCard({ url }: Props) {
  const { data, isLoading } = useQuery(["fetchVideo", url], async () => {
    const { data } = await youtubeService.getVideoInfo(url);
    return data;
  });

  return (
    <div className="flex border p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>Error</div>
      ) : (
        <>
          <img
            className="mr-2"
            src={data.thumbnail_url}
            alt={data.title}
            width={"10%"}
          />
          <div>
            <h3>{data.title}</h3>
            <p>{data.author_name}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(VideoCard);
