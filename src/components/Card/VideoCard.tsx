/* eslint-disable @next/next/no-img-element */
import { memo, useState } from "react";
import { useQuery } from "react-query";
import youtubeService from "src/services/youtubeService";
import { BiLike, BiDislike } from "react-icons/bi";
import { trpc } from "src/utils/trpc";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

type TVoteType = "upVotes" | "downVotes" | "";

type Props = {
  id: string;
  url: string;
  email: string;
  voteType: TVoteType;
};

function VideoCard({ id, url, email, voteType }: Props) {
  const { data: session } = useSession();
  const [currentVoteType, setCurrentVoteType] = useState(voteType);

  const voteMutation = trpc.useMutation(["voting.vote"]);
  const unVoteMutation = trpc.useMutation(["voting.unVote"]);

  const { data, isLoading } = useQuery(["fetchVideo", url], async () => {
    const { data } = await youtubeService.getVideoInfo(url);
    return data;
  });

  const vote = async (type: "upVotes" | "downVotes") => {
    const _currentVoteType = currentVoteType;

    try {
      if (currentVoteType === type) {
        setCurrentVoteType("");
        await unVoteMutation.mutateAsync({
          videoId: id,
        });
      } else {
        setCurrentVoteType(type);
        await voteMutation.mutateAsync({
          videoId: id,
          type,
        });
      }
    } catch (error) {
      toast.error("An error occurred, please try again later!");
      setCurrentVoteType(_currentVoteType);
    }
  };

  return (
    <div className="flex border p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>Error</div>
      ) : (
        <>
          <div
            className="video-container mr-4 w-1/4"
            dangerouslySetInnerHTML={{ __html: data.html }}
          ></div>
          <div className="pr-4">
            <h3 className="text-xl font-bold">{data.title}</h3>
            <p>Author: {data.author_name}</p>
            <p>Shared by: {email}</p>
          </div>
          {session?.user && (
            <div className="ml-auto flex h-full flex-col items-center justify-center">
              <button
                className={
                  currentVoteType == "upVotes"
                    ? "text-blue-500"
                    : "text-gray-400"
                }
                onClick={() => vote("upVotes")}
              >
                <BiLike size={24} />
              </button>
              <button
                className={
                  currentVoteType == "downVotes"
                    ? "text-red-500"
                    : "text-gray-400"
                }
                onClick={() => vote("downVotes")}
              >
                <BiDislike size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(VideoCard);
