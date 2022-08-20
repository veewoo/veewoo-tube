import { useSession } from "next-auth/react";
import { trpc } from "src/utils/trpc";
import VideoCard from "../Card/VideoCard";

function VideoList() {
  const { data: session } = useSession();
  const { data, isLoading } = trpc.useQuery(["video.all", session?.user?.id]);

  const getVoteStatus = (videoId: string) => {
    if (!session?.user) {
      return "";
    }

    const user = session.user;

    if (user.upVotes.includes(videoId)) {
      return "upVotes";
    }

    if (user.downVotes.includes(videoId)) {
      return "downVotes";
    }

    return "";
  };

  return (
    <div className="container mx-auto mt-4 space-y-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>Data not found!</div>
      ) : (
        data.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            url={video.url}
            email={video.User.email ?? "unknown"}
            voteType={getVoteStatus(video.id)}
          />
        ))
      )}
    </div>
  );
}

export default VideoList;
