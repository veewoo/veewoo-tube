import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createProtectedRouter } from "./protected-router";
import { createRouter } from "./context";

export const videoRouter = createRouter().query("all", {
  input: z.ostring(),
  async resolve({ ctx }) {
    return await ctx.prisma.video.findMany({
      include: {
        User: true,
      },
    });
  },
});
export const editVideoRouter = createProtectedRouter()
  .mutation("add", {
    input: z.object({ url: z.string().url("Invalid url") }),
    async resolve({ input, ctx }) {
      try {
        const { url } = input;

        const video = await ctx.prisma.video.create({
          data: {
            url,
            userId: ctx.session?.user?.id ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return video;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          ...(error as Error),
        });
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      redirectId: z.string(),
      // target: instanceSchema,
    }),
    async resolve({ input, ctx }) {
      try {
        // const { redirectId, target } = input;
        // const domain = `https://${buildDomain({ target })}`;
        // await request<IRedirectInput>(`${domain}/v1/redirects/${redirectId}`, {
        //   method: "DELETE",
        //   target,
        //   headers: getHeaders(ctx.session?.user?.id ?? "", domain),
        // });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          ...(error as Error),
        });
      }
    },
  });
