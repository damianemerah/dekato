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
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        await dbConnect();

        const user = await User.findOne({ email: email }).select("+password");
        console.log("👇🔥👇", user);

        if (!user) {
          throw new Error("User with that email not found");
        }

        if (!(await user.correctPassword(password, user?.password))) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, "token🕊️🕊️🕊️");
      if (user) {
        token.user = {
          id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...token.user };
      console.log(session, "session🚀🚀🚀");
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(options);
