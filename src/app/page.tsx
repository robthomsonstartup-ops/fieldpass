import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#FAFAF8] px-4 py-16">
      <main className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#DC2626]">
          Fieldpass
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1D2A] sm:text-4xl">
          Field access, simplified.
        </h1>
        <p className="mt-4 text-base leading-7 text-[#6B7280]">
          Sign in to your dashboard or create an account to get started.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-[#0B1D2A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B1D2A]/90"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-[#0B1D2A]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1D2A] transition hover:bg-[#0B1D2A]/5"
          >
            Create account
          </Link>
        </div>
      </main>
    </div>
  );
}
