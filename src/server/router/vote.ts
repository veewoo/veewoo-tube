import { TRPCError } from "@trpc/server";
import { PrismaClient, User } from "prisma/generated/client";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const voteRouter = createProtectedRouter()
  .mutation("vote", {
    input: z.object({
      videoId: z.string(),
      type: z.enum(["upVotes", "downVotes"]),
    }),
    async resolve({ input, ctx }) {
      try {
        const { videoId, type } = input;

        const user = await getUser(ctx.session?.user?.id ?? "", ctx.prisma);

        await unVotes(user, videoId, ctx.prisma);

        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { [type]: [...(user[type] ?? []), videoId] },
        });

        return true;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          ...(error as Error),
        });
      }
    },
  })
  .mutation("unVote", {
    input: z.object({
      videoId: z.string(),
    }),
    async resolve({ input, ctx }) {
      try {
        const { videoId } = input;

        const user = await getUser(ctx.session?.user?.id ?? "", ctx.prisma);

        await unVotes(user, videoId, ctx.prisma);

        return true;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          ...(error as Error),
        });
      }
    },
  });

async function getUser(id: string, prisma: PrismaClient) {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      });
    }

    return user;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User not found",
    });
  }
}

async function unVotes(user: User, videoId: string, prisma: PrismaClient) {
  const voteTypes = ["upVotes", "downVotes"];

  for (let i = 0; i < voteTypes.length; i++) {
    const item = voteTypes[i];

    const key = item as "upVotes" | "downVotes";
    const index = user[key]?.indexOf(videoId) ?? -1;
    if (index == -1) continue;

    user[key].splice(index, 1);

    await prisma.user.update({
      where: { id: user.id },
      data: { [key]: user[key] },
    });
  }
}
