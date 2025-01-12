import Link from "next/link";
import { ButtonSecondary } from "@/app/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grayBg px-4 text-center">
      <div className="mx-auto max-w-lg">
        <h1 className={`mb-4 text-4xl font-bold text-primary`}>
          404 - Page Not Found
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/">
          <ButtonSecondary className="border-2 border-primary bg-white px-6 py-2 font-oswald text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white">
            Back to Homepage
          </ButtonSecondary>
        </Link>
      </div>
    </div>
  );
}
