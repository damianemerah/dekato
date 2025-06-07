import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from '@/app/lib/mongoConnection';
import User from '@/models/user';
import NextAuth from 'next-auth';

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error('Please provide email and password');
          }

          await dbConnect();

          const user = await User.findOne({ email })
            .select('+password +passwordChangedAt')
            .lean();

          if (!user) {
            throw new Error(
              'It looks like there’s no account registered with that email address.'
            );
          }

          const isValidPassword =
            await User.schema.methods.correctPassword.call(
              user,
              password,
              user.password
            );

          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          return user;
        } catch (error) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        try {
          await dbConnect();

          const existingUser = await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                email: user.email,
                firstname: profile.given_name || user.name?.split(' ')[0] || '',
                lastname: profile.family_name || user.name?.split(' ')[1] || '',
                emailVerified: true,
                role: 'user',
              },
            },
            {
              upsert: true,
              new: true,
              lean: true,
            }
          );

          Object.assign(user, {
            _id: existingUser._id,
            role: existingUser.role,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
          });

          return true;
        } catch (error) {
          console.error('Error during OAuth sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        Object.assign(token, {
          id: user._id,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
          passwordChangedAt: user.passwordChangedAt?.getTime() || null,
        });
      }

      if (trigger === 'update' && session?.passwordChanged) {
        token.passwordChangedAt = Date.now();
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

        if (
          token.passwordChangedAt &&
          token.passwordChangedAt > token.iat * 1000
        ) {
          return null;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
