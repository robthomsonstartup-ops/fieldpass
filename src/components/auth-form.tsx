"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  login,
  signUp,
  type AuthActionState,
} from "@/app/auth/actions";

const initialState: AuthActionState = {};

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? login : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#0B1D2A]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-[#0B1D2A]/15 bg-white px-3 py-2.5 text-[#0B1D2A] outline-none transition focus:border-[#0A7C7B] focus:ring-2 focus:ring-[#0A7C7B]/20"
          placeholder="you@company.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-[#0B1D2A]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "signup" ? 8 : undefined}
          className="rounded-lg border border-[#0B1D2A]/15 bg-white px-3 py-2.5 text-[#0B1D2A] outline-none transition focus:border-[#0A7C7B] focus:ring-2 focus:ring-[#0A7C7B]/20"
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-[#DC2626]/10 px-3 py-2 text-sm text-[#DC2626]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-[#0B1D2A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B1D2A]/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? mode === "login"
            ? "Signing in…"
            : "Creating account…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#0A7C7B] hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#0A7C7B] hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
