import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D2A]">Dashboard</h1>
        <p className="mt-1 text-[#6B7280]">
          You&apos;re signed in as{" "}
          <span className="font-medium text-[#0B1D2A]">{user?.email}</span>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-[#0B1D2A]/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
            Status
          </h2>
          <p className="mt-2 text-lg font-semibold text-[#6EA96F]">Active session</p>
          <p className="mt-1 text-sm text-[#6B7280]">
            Supabase auth is wired up and your route is protected.
          </p>
        </section>

        <section className="rounded-xl border border-[#0B1D2A]/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
            Next step
          </h2>
          <p className="mt-2 text-lg font-semibold text-[#0B1D2A]">
            Complete onboarding
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            New accounts land on the onboarding flow after sign up.
          </p>
        </section>
      </div>
    </div>
  );
}
