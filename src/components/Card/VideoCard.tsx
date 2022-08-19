import { ReactNode, useState } from "react";
import { useQuery } from "react-query";
import youtubeService from "src/services/youtubeService";
import { VideoInfo } from "src/types/video";

type Props = {
  url: string;
};

function VideoCard({ url }: Props) {
  const [video, setVideo] = useState<VideoInfo | null>(null);

  const { data, isLoading } = useQuery("fetchVideo", async () => {
    const { data } = await youtubeService.getVideoInfo(url);
    return data;
  });

  return <div className="border p-4"></div>;
}

export default VideoCard;
