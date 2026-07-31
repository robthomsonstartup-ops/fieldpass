import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#FAFAF8] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#0B1D2A]/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold tracking-wide text-[#DC2626]">
            Fieldpass
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[#0B1D2A]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Sign in to access your dashboard.
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
