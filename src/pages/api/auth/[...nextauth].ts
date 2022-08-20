import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "src/server/db/client";
import { loginSchema } from "src/utils/auth";
import { User } from "prisma/generated/client";

const THREE_DAYS = 3 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: THREE_DAYS,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const user = await prisma.user.findFirst({
          where: { id: token.user.id },
        });

        if (user) session.user = user;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findFirst({
            where: { email },
          });

          if (!user) throw new Error("USER_NOT_FOUND");

          const isPasswordValid = await compare(password, user.password ?? "");

          if (!isPasswordValid) {
            throw new Error("INVALID_PASSWORD");
          }

          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
