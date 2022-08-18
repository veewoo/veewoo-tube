import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

export const authRouter = createRouter().mutation("signUp", {
  input: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be 6 characters or more."),
  }),
  async resolve({ input, ctx }) {
    try {
      const { email, password } = input;
      const hasedPassword = await hash(password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hasedPassword,
        },
      });

      console.log("sign up ================\n", { user });

      return true;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        ...(error as Error),
      });
    }
  },
});
