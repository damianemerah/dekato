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
      if (user) {
        token.user = {
          id: user._id,
          email: user.email,
          name: user.firstname,
          role: user.role,
        };

        token.name = user.firstname;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...token.user };
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(options);
