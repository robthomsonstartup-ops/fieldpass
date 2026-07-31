import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12" style={{ background: '#07111d' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-bold tracking-wide" style={{ color: '#1db954' }}>
            FieldPass
          </Link>
          <h1 className="mt-3 text-2xl font-extrabold" style={{ color: '#f0f6ff', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--fp-muted)' }}>
            Sign in to access your dashboard.
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
