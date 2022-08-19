import axios from "axios";
import { VideoInfo } from "src/types/video";

const youtubeService = {
  getVideoInfo: async (url: string) => {
    return await axios.get<VideoInfo>(
      `https://www.youtube.com/oembed?url=${url}&format=json`
    );
  },
};

export default youtubeService;
