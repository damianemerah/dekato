import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/mongoConnection';
import User from '@/models/user';
import { cookies } from 'next/headers';

//isLoggedin middleware
export const protect = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
    return null;
  }

  await dbConnect();

  const currentUser = await User.findById(session.user.id).select(
    '+passwordChangedAt'
  );

  const passwordChangedAt = currentUser.passwordChangedAt;

  if (passwordChangedAt) {
    const passwordChangedTimestamp = passwordChangedAt.getTime() / 1000;

    if (passwordChangedTimestamp > session.user.iat) {
      const cookieStore = cookies();
      cookieStore.delete('next-auth.session-token');
      redirect('/signin');
    }
  }

  return session;
};

export const restrictTo = async (...roles) => {
  const session = await protect();
  if (!session?.user || !roles.includes(session.user.role)) {
    // return { error: "You do not have permission to perform this action" };
    redirect('/');
  }
  return session;
};
