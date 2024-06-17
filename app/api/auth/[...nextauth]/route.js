import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "@/utils/mongoConnection";
import User from "@/models/user";
import NextAuth from "next-auth";

export const OPTIONS = {
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
    async jwt({ token, _, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...token,
      };

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
