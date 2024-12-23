import Link from "next/link";
import { ButtonSecondary } from "@/app/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
      <h1 className="mb-4 text-5xl font-bold text-gray-900">
        404 - Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-xl text-gray-600">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <ButtonSecondary className="px-8 py-3 text-lg shadow-md transition-transform hover:scale-105">
          Go back to homepage
        </ButtonSecondary>
      </Link>
    </div>
  );
}
