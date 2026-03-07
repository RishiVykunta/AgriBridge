import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-8 sm:px-6" role="contentinfo">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
          >
            AgriBridge
          </Link>
          <nav className="flex gap-6 text-sm text-zinc-600" aria-label="Footer links">
            <Link href="/login" className="hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
              Login
            </Link>
            <Link href="/signup" className="hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
              Sign up
            </Link>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-7xl text-center text-sm text-zinc-500">
          © 2026 AgriBridge. Agricultural bridge platform.
        </p>
      </div>
    </footer>
  );
}
