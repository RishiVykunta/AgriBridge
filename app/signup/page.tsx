import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { PasswordField } from "@/app/components/PasswordField";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams;
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
          <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sign up to join the AgriBridge network.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form action={signup} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
                Mobile Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                pattern="[6-9]\d{9}"
                title="Please enter a valid 10-digit Indian mobile number."
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="10-digit mobile (e.g. 9876543210)"
              />
            </div>
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
                placeholder="you@gmail.com"
              />
            </div>
            <PasswordField
              id="password"
              name="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Strong password (8+ chars)"
              minLength={8}
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              minLength={8}
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
