import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

export async function auth() {
  const session = await getServerSession(OPTIONS);
  return session;
}