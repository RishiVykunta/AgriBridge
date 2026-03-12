import Link from "next/link";
import { login } from "@/app/actions/auth";
import { PasswordField } from "@/app/components/PasswordField";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-emerald-700">
            AgriBridge
          </Link>
          <Link href="/signup" className="text-sm text-zinc-600 hover:text-zinc-900">
            Sign up
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Log in</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your email and password to continue.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form action={login} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <PasswordField
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              placeholder="Your password"
            />
            <div className="flex items-center justify-end mt-2">
              <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700 mt-4"
            >
              Log in
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <div className="w-full border-t border-zinc-200"></div>
            <span className="px-3 text-xs uppercase text-zinc-500 bg-white">Or continue with</span>
            <div className="w-full border-t border-zinc-200"></div>
          </div>

          <div className="mt-6">
            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Sign in with Google
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don’t have an account?{" "}
            <Link href="/signup" className="font-medium text-emerald-600 hover:text-emerald-700">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
