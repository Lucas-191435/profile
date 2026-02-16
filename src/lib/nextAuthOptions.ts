import { PrivateRoutes } from "@/constants/mapperRoutes";
import { IUser } from "@/types/IUser";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          const response = await axios.post<{ user: IUser; token: string }>(
            process.env.baseUrl + "/auth/login",
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-forwarded-for": req?.headers?.["x-forwarded-for"],
              },
            },
          );
          const { user } = response.data || {};

          if (user && response.status === 200) {
            return {
              ...user,
              token: response.data.token,
            };
          }

          if (user?.role === "CLIENT") {
            redirect(PrivateRoutes.client.dashboard);
          } else if (user?.role === "CONSULTANT") {
            redirect(PrivateRoutes.consultant.dashboard);
          }

          return null;
        } catch (err: any) {
          console.error(err?.response?.data?.message);
          // console.log("Login failed err response:", err?.response);
          if (
            err?.response?.data?.message ===
            "Sua conta foi desativada. Entre em contato com o suporte."
          ) {
            throw new Error(
              "Sua conta foi desativada. Entre em contato com o suporte.",
            );
          }
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 horas
    updateAge: 60 * 60, // 1 hora
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
      },
    },
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Login inicial
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.apiToken = (user as any)?.token;
        token.isConsultantContext = (user as any)?.isConsultantContext;
        token.originalConsultantId = (user as any)?.originalConsultantId;
        token.clientId = (user as any)?.clientId;
      }

      // Update da sessão (context switch)
      if (trigger === "update" && session) {
        token.userId = session.user.id;
        token.email = session.user.email;
        token.name = session.user.name;
        token.role = session.user.role;
        token.apiToken = session.user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as any,
        token: token.apiToken as string,
      };
      session.token = token.apiToken as string;
      return session;
    },
  },
};
