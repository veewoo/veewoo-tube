import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { loginSchema } from "src/utils/auth";
import { User } from "prisma/generated/client";
import axios from "axios";

const THREE_DAYS = 3 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: THREE_DAYS,
  },
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      // if (session.user) {
      //   session.user.id = user.id;
      // }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findFirst({
            where: { email },
          });

          if (!user) throw new Error("USER_NOT_FOUND");

          const isPasswordValid = await comparePassword(user, password);

          if (!isPasswordValid) {
            throw new Error("PASSWORD_INVALID");
          }

          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
};

async function comparePassword(user: User, password: string) {
  return await compare(password, user.password ?? "");
}

export default NextAuth(authOptions);
