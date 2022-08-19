import { ReactNode, useState } from "react";
import { useQuery } from "react-query";
import youtubeService from "src/services/youtubeService";
import { VideoInfo } from "src/types/video";
import { trpc } from "src/utils/trpc";
import VideoCard from "../Card/VideoCard";

type Props = {
  url: string;
};

function VideoList() {
  const { data, isLoading } = trpc.useQuery(["video.all"]);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Data not found!</div>;

  return (
    <div className="container mx-auto mt-4">
      {data.map((video) => (
        <VideoCard key={video.id} url={video.url} />
      ))}
    </div>
  );
}

export default VideoList;
