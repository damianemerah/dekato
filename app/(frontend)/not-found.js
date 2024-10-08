import Link from "next/link";
import { ButtonSecondary } from "@/app/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">404 - Not Found</h1>
      <p className="mb-8 text-xl">
        Sorry, the category or product you&apos;re looking for doesn&apos;t
        exist.
      </p>
      <Link href="/">
        <ButtonSecondary>Go back to homepage</ButtonSecondary>
      </Link>
    </div>
  );
}
