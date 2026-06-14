// src/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        try {
          let user = await db.user.findUnique({
            where: { email },
          });

          // Create a new user if not found
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await db.user.create({
              data: {
                email,
                username: email.split("@")[0],
                password: hashedPassword,
                role: "user",
                isVerified: true,
                phone_num: "", // default required by your schema
              },
            });
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) return null;

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
    // ✅ Create Google user if not in DB and set proper ID
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });
    
        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              email: user.email!,
              username:
                user.name?.toLowerCase().replace(/\s+/g, "_") ||
                `user_${Date.now()}`,
              password: "", // Google users don't need password
              phone_num: `google_${Date.now()}`, // temporary unique placeholder
              isVerified: true,
              role: "user",
            },
          });
          user.dbId = newUser.id.toString();
        } else {
          user.dbId = existingUser.id.toString();
        }
      }
    
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.dbId) {
          token.id = user.dbId;
        } else {
          token.id = user.id;
        }
        token.username = user.username || user.name || "";
        token.role = user.role || "user";
      }
      return token;
    },

    async session({ session, token }) {
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
