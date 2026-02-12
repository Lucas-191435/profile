import NextAuth from "next-auth";
import { IUser } from "./IUser";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser & DefaultSession["user"];
    token: string;
  }
}
