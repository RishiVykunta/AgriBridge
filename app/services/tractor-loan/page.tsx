import Link from "next/link";

export default function TractorLoanPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900">
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
        <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Services
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
            Tractor Loan
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Apply for a tractor loan (SBI). Sign in is required to continue.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>Flexible tenure options</li>
                <li>Fast eligibility check</li>
                <li>Easy document submission</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-sm font-semibold text-zinc-900">
                Documents (typical)
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>ID proof</li>
                <li>Address proof</li>
                <li>Land / income details</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700">
              ← Back to Home
            </Link>
            <p className="text-xs text-zinc-500">Bank preference: SBI</p>
          </div>

          <Link
            href="/signup"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700"
          >
            Apply Now
          </Link>
        </div>
      </main>
    </div>
  );
}

