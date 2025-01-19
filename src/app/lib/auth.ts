// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import Google from "next-auth/providers/google"


// const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "Ov23liOmxTA0Lckt7wGy",
//       clientSecret: process.env.GITHUB_SECRET || "2f4946851bf5b5bdf61ccfa4fe377e76db1bce69",
//     }),
//   ],
// };

// export default NextAuth(authOptions);



 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Google],
// })

import NextAuth, { DefaultSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

// Extend the session and token types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Ensure user and token exist before setting the ID
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user ID in the JWT token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
