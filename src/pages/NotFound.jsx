import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br px-4 text-center">
      <h1 className="mb-2 text-7xl font-bold tracking-tight">404</h1>
      <p className="mb-6 text-xl">
        This page doesn't exist or might have been moved.
      </p>
      <Link
        to="/app/search"
        className="rounded-xl bg-white px-5 py-2 font-medium text-black transition duration-200 hover:opacity-90 dark:bg-black dark:text-white"
      >
        Back to App
      </Link>
    </main>
  );
}
