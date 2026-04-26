import type { NextAuthConfig } from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

const googleEnv =
  process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim();

/**
 * Edge-safe: no Prisma, no database adapter, no credential authorize.
 * Used by `middleware` only. API routes and server code use the full `auth` from `auth.ts`.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    ...(googleEnv
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, trigger, token }: { session: Session; trigger?: "update"; token: JWT }) {
      session.user.id = token.sub ?? "";
      session.user.role = (token.role as string) ?? "user";
      if (trigger === "update" && token.name) {
        session.user.name = token.name;
      }
      if (token.picture) {
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
