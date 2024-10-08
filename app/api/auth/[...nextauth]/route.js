import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoConnection";
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
        try {
          const { email, password } = credentials;

          await dbConnect();

          const user = await User.findOne({ email: email }).select(
            "+password +passwordChangedAt",
          );
          if (!user) {
            throw new Error("User with that email not found");
          }

          if (!(await user.correctPassword(password, user?.password))) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user._id;
        token.role = user.role;
        token.passwordChangedAt = user.passwordChangedAt?.getTime() || null;
      }

      if (trigger === "update" && session?.passwordChanged) {
        token.passwordChangedAt = new Date().getTime();
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role,
          email: token.email,
          iat: token.iat,
        };

        if (token.passwordChangedAt) {
          if (token.passwordChangedAt > token.iat * 1000) {
            return null;
          }
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
