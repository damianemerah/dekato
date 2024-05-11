import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="mx-auto h-screen">
      <main className="main">
        <h1 className="text-4xl font-bold text-center mt-8">
          Welcome to the Store
        </h1>
        <p className="text-center mt-4">
          This is a simple store built with Next.js and Tailwind CSS
        </p>
      </main>
    </div>
  );
}
