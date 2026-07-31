"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
  createOrganization,
  createTeam,
  type OrganizationActionState,
  type TeamActionState,
} from "@/app/dashboard/onboarding/actions";
import {
  AGE_GROUPS,
  ONBOARDING_STEPS,
  PLAY_LEVELS,
} from "@/lib/onboarding/constants";
import {
  buttonPrimaryClassName,
  inputClassName,
  labelClassName,
} from "@/lib/form-styles";
import { ZipLookup } from "@/components/ZipLookup";

const initialOrganizationState: OrganizationActionState = {};
const initialTeamState: TeamActionState = {};

type OnboardingData = {
  organizationId: string;
  programName: string;
  teamName: string;
};

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null,
  );
  const [organizationState, organizationAction, organizationPending] =
    useActionState(createOrganization, initialOrganizationState);
  const [teamState, teamAction, teamPending] = useActionState(
    createTeam,
    initialTeamState,
  );

  useEffect(() => {
    if (organizationState.organizationId && organizationState.programName) {
      setOnboardingData((current) => ({
        organizationId: organizationState.organizationId!,
        programName: organizationState.programName!,
        teamName: current?.teamName ?? "",
      }));
      setStep(2);
    }
  }, [organizationState.organizationId, organizationState.programName]);

  useEffect(() => {
    if (!teamState.teamName) {
      return;
    }

    setOnboardingData((current) =>
      current
        ? { ...current, teamName: teamState.teamName! }
        : null,
    );
    setStep(3);
  }, [teamState.teamName]);

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0A7C7B]">
          Step {step} of {ONBOARDING_STEPS}
        </p>
        <div className="flex gap-2">
          {Array.from({ length: ONBOARDING_STEPS }, (_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                index < step ? "bg-[#0A7C7B]" : "bg-[#0B1D2A]/10"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <section className="rounded-2xl border border-[#0B1D2A]/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0B1D2A]">
              Create organization
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Tell us about your program so we can set up your workspace.
            </p>
          </div>

          <form action={organizationAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={labelClassName}>
                Program name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={inputClassName}
                placeholder="Metro Elite Baseball"
              />
            </div>

            <ZipLookup />

            {organizationState.error ? (
              <p className="rounded-lg bg-[#DC2626]/10 px-3 py-2 text-sm text-[#DC2626]">
                {organizationState.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={organizationPending}
              className={`mt-2 ${buttonPrimaryClassName}`}
            >
              {organizationPending ? "Creating organization…" : "Continue"}
            </button>
          </form>
        </section>
      ) : null}

      {step === 2 && onboardingData ? (
        <section className="rounded-2xl border border-[#0B1D2A]/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0B1D2A]">
              Create first team
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Add the first team for{" "}
              <span className="font-medium text-[#0B1D2A]">
                {onboardingData.programName}
              </span>
              .
            </p>
          </div>

          <form action={teamAction} className="flex flex-col gap-5">
            <input
              type="hidden"
              name="organization_id"
              value={onboardingData.organizationId}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="team_name" className={labelClassName}>
                Team name
              </label>
              <input
                id="team_name"
                name="team_name"
                type="text"
                required
                className={inputClassName}
                placeholder="12U Navy"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="age_group" className={labelClassName}>
                Age group
              </label>
              <select
                id="age_group"
                name="age_group"
                required
                defaultValue=""
                className={inputClassName}
              >
                <option value="" disabled>
                  Select age group
                </option>
                {AGE_GROUPS.map((ageGroup) => (
                  <option key={ageGroup} value={ageGroup}>
                    {ageGroup}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="space-y-3">
              <legend className={labelClassName}>Play level</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PLAY_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 rounded-lg border border-[#0B1D2A]/10 px-3 py-2 text-sm text-[#0B1D2A]"
                  >
                    <input
                      type="checkbox"
                      name="play_level"
                      value={level}
                      className="rounded border-[#0B1D2A]/20 text-[#0A7C7B] focus:ring-[#0A7C7B]/20"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="travel_radius_miles" className={labelClassName}>
                Travel radius (miles)
              </label>
              <input
                id="travel_radius_miles"
                name="travel_radius_miles"
                type="number"
                min={1}
                defaultValue={100}
                className={inputClassName}
              />
            </div>

            {teamState.error ? (
              <p className="rounded-lg bg-[#DC2626]/10 px-3 py-2 text-sm text-[#DC2626]">
                {teamState.error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-[#0B1D2A]/15 px-4 py-2.5 text-sm font-semibold text-[#0B1D2A] transition hover:bg-[#0B1D2A]/5"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={teamPending}
                className={`sm:flex-1 ${buttonPrimaryClassName}`}
              >
                {teamPending ? "Creating team…" : "Continue"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {step === 3 && onboardingData?.teamName ? (
        <section className="rounded-2xl border border-[#0B1D2A]/10 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#6EA96F]/15 text-[#6EA96F]">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#0B1D2A]">
            You&apos;re all set
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            <span className="font-medium text-[#0B1D2A]">
              {onboardingData.programName}
            </span>{" "}
            and{" "}
            <span className="font-medium text-[#0B1D2A]">
              {onboardingData.teamName}
            </span>{" "}
            are ready to go.
          </p>

          <Link
            href="/dashboard"
            className={`mt-8 inline-flex ${buttonPrimaryClassName}`}
          >
            Go to dashboard
          </Link>
        </section>
      ) : null}
    </div>
  );
}
