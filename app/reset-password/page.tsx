import Link from "next/link";
import { completePasswordReset } from "@/app/actions/auth";

type Props = { searchParams: Promise<{ token?: string; error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, error } = await searchParams;

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
          <h1 className="text-2xl font-semibold text-zinc-900">Set New Password</h1>
          <p className="mt-1 text-sm text-zinc-500 mb-6">
            Enter your new password below.
          </p>

          {!token ? (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Invalid or missing password reset token.
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              
              <form action={completePasswordReset} className="space-y-4">
                <input type="hidden" name="token" value={token} />
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="At least 8 characters"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}

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
