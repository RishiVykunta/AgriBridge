import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { PasswordField } from "@/app/components/PasswordField";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100/50 blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />

      <header className="relative z-10 border-b border-white/20 bg-white/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-800">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              A
            </div>
            AgriBridge
          </Link>
          <Link href="/login" className="group flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
            Log in
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 p-10 shadow-2xl shadow-emerald-900/5 backdrop-blur-xl transition-all hover:shadow-emerald-900/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create account</h1>
            <p className="mt-2 text-zinc-600">
              Join the AgriBridge network today
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50/50 border border-red-100 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            </div>
          )}

          <form action={signup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-0.5">
                Full Name <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-zinc-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-0.5">
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
                className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-zinc-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-0.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-zinc-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="name@example.com"
              />
            </div>
            <PasswordField
              id="password"
              name="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
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
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-700/30 active:scale-[0.98] mt-4"
            >
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-600/30 hover:decoration-emerald-700">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
