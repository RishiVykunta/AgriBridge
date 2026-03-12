import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";

type Props = { searchParams: Promise<{ error?: string, message?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-emerald-700">
            AgriBridge
          </Link>
          <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">
            Log in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Reset Password</h1>
          <p className="mt-1 text-sm text-zinc-500 mb-6">
            Enter your email to receive a password reset link.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <form action={requestPasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
