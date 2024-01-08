import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import NextAuth from "next-auth";

const options = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        console.log(email, password, "result");

        await dbConnect();

        const user = await User.findOne({ email: email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (!(await user.correctPassword(password, user?.password))) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callback: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(options);
