import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const videoRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.video.findMany();
    },
  })
  .mutation("add", {
    input: z.object({ url: z.string().url("Invalid url") }),
    async resolve({ input, ctx }) {
      try {
        const id = ctx.session?.user?.id ?? "";

        if (!id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to add a video.",
          });
        }

        const { url } = input;

        const video = await ctx.prisma.video.create({
          data: {
            url,
            userId: id,
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
  .mutation("edit", {
    input: z.object({
      redirectId: z.string(),
    }),
    async resolve({ input, ctx }) {
      try {
        // const { redirectId, data, target } = input;
        // const domain = `https://${buildDomain({ target })}`;
        // const response = await request<IRedirectInput>(
        //   `${domain}/v1/redirects/${redirectId}/update`,
        //   {
        //     method: "PATCH",
        //     data,
        //     target,
        //     headers: getHeaders(ctx.session?.user?.id ?? "", domain),
        //   }
        // );
        // return response.data;
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
