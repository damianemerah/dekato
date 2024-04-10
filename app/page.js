<<<<<<< HEAD
import Image from "next/image";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

export default async function Home() {
  const { data: session } = await getServerSession();
  console.log("📩🌞🌞📩", session);

=======
export default function Home() {
>>>>>>> 2c1918b3506d3d91c9e25a67ea6489082eefbef0
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      Hello World!
    </main>
  );
}
