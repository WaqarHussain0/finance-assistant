import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "../../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../../constant/tables.constant";
import { PAGE_LINK } from "../../../../constant/page-link.constant";

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "NEXTAUTH_SECRET is not set. Please check your .env.local file."
  );
}

if (!process.env.NEXTAUTH_URL) {
  console.warn("NEXTAUTH_URL is not set. Please check your .env.local file.");
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabase
            .from(TABLE_NAMES.users)
            .select("id, email, name, password")
            .eq("email", credentials.email)
            .single();

          if (error || !user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
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
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
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
