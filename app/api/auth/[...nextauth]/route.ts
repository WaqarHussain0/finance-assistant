// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PAGE_LINK } from "../../../../constant/page-link.constant";

interface SupabaseJWT extends JwtPayload {
  email?: string;
  sub?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Supabase",
      credentials: {
        access_token: { label: "Access Token", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.access_token) return null;

        try {
          const decoded = jwt.verify(
            credentials.access_token,
            process.env.SUPABASE_JWT_SECRET!
          ) as SupabaseJWT;

          if (!decoded.sub || !decoded.email) return null;

          // Return object that matches NextAuth's User type
          return {
            id: decoded.sub,
            email: decoded.email,
            name: "", // Optional but keeps TS happy
          };
        } catch (err) {
          console.error("JWT verification failed", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: PAGE_LINK.signin,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
});

export { handler as GET, handler as POST };
