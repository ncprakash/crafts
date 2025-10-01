// src/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          let user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          // If user does not exist, optionally create a new one (with required fields)
          if (!user) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            user = await db.user.create({
              data: {
                email: credentials.email,
                username: credentials.email.split("@")[0],
                password: hashedPassword,
                role: "user",
                isVerified: true, // set true for credentials signup, change logic if email verification needed
                phone_num: "", // provide default to satisfy Prisma schema
              },
            });
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;

          // Check if verified
          if (!user.isVerified) throw new Error("Please verify your email before signing in");

          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            name: user.username,
            role: user.role || "user",
          };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});
