import { nextAuthOptions } from "@/lib/nextAuthOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
