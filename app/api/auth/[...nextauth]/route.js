import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "your-google-client-id",
      clientSecret: process.env.GOOGLE_SECRET || "your-google-client-secret",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || "your-facebook-client-id",
      clientSecret:
        process.env.FACEBOOK_SECRET || "your-facebook-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error("Please provide email and password");
          }

          await dbConnect();

          const user = await User.findOne({ email }).select(
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
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "facebook") {
        try {
          await dbConnect();

          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            existingUser = await User.create({
              email: user.email,
              firstname: profile.given_name || user.name?.split(" ")[0] || "",
              lastname: profile.family_name || user.name?.split(" ")[1] || "",
              emailVerified: true,
              role: "user",
            });
          }

          // Update user object with existing user details
          user._id = existingUser._id;
          user.role = existingUser.role;
          user.firstname = existingUser.firstname;
          user.lastname = existingUser.lastname;

          return true;
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user._id;
        token.role = user.role;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
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
          firstname: token.firstname,
          lastname: token.lastname,
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
