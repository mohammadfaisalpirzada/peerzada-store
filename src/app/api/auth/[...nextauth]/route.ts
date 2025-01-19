// import NextAuth from "next-auth";
// import type { NextAuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

// // Auth options configuration
// export const authOptions: NextAuthOptions = {
//   secret: process.env.AUTH_SECRET || "",
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || "",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//   ],
//   pages: {
//     signIn: "/login", // Custom login page
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import type { NextAuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

// // Auth options configuration
// export const authOptions: NextAuthOptions = {
//   secret: process.env.AUTH_SECRET || "",
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || "",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//   ],
//   pages: {
//     signIn: "/login", // Custom login page
//   },
// };

// // Create and export the auth handler
// const handler = NextAuth(authOptions);

// // Export the handler as both GET and POST
// export { handler as GET, handler as POST };

// // Add type declaration for better type safety
// export type AuthType = typeof handler;




import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Define the auth options configuration
const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET || "",
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

// Create the auth handler
const handler = NextAuth(authOptions);

// Export only the handler functions
export { handler as GET, handler as POST };