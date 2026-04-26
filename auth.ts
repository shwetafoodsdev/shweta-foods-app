import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compareSync } from "bcrypt-ts-edge";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const googleEnv =
  process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim();

export const config = {
  trustHost: true,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isValid = compareSync(credentials.password as string, user.password);
          if (!isValid) {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
    ...(googleEnv
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const row = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, id: true },
        });
        if (row) {
          token.role = row.role;
          token.sub = row.id;
        } else {
          token.role = (user as { role?: string }).role ?? "user";
        }
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = (user as { image?: string | null }).image ?? token.picture;
      }
      return token;
    },
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

export const { handlers, auth, signIn, signOut } = NextAuth(config);
