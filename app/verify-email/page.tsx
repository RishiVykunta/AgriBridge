import { redirect } from "next/navigation";
import { verifyEmail } from "@/app/actions/auth";
import Link from "next/link";

type Props = { 
  searchParams: Promise<{ email?: string; error?: string; message?: string }> 
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email, error, message } = await searchParams;

  if (!email) {
    redirect("/signup");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <h1 className="text-2xl font-black text-zinc-900">Verify your email</h1>
          <p className="mt-2 text-zinc-500">
            Enter the 6-digit code sent to your email <span className="font-bold text-zinc-900">{email}</span>.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-100">
            {message}
          </div>
        )}

        <form action={verifyEmail} className="space-y-6">
          <input type="hidden" name="email" value={email} />
          
          <div>
            <label htmlFor="code" className="block text-sm font-bold text-zinc-700 uppercase tracking-widest mb-2">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              pattern="\d{6}"
              placeholder="123456"
              autoComplete="one-time-code"
              className="block w-full text-center text-3xl font-black tracking-[0.2em] rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            Verify Email
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-500">
            Didn't receive the code?{" "}
            <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
              Try a different email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
