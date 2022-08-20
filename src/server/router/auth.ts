import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { PrismaClient } from "prisma/generated/client";

export const authRouter = createRouter().mutation("signUp", {
  input: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be 6 characters or more."),
  }),
  output: z.object({ error: z.ostring() }),
  async resolve({ input, ctx }) {
    try {
      if (await isEmailExists(input.email, ctx.prisma)) {
        return {
          error: "Email already exists",
        };
      }

      const { email, password } = input;
      const hashedPassword = await hash(password, 10);

      await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {};
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        ...(error as Error),
      });
    }
  },
});

async function isEmailExists(email: string, prisma: PrismaClient) {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return !!user;
}
