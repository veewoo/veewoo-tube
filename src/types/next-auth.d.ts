import { DefaultSession } from "next-auth";
import { User } from "prisma/generated/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"] &
      User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}
