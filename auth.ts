import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
          if (!user.emailVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
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
    ...authConfig.providers,
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
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
  },
});
