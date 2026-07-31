"use server";

import { createClient } from "@/lib/supabase/server";
import {
  AGE_GROUPS,
  PLAY_LEVELS,
  type AgeGroup,
  type PlayLevel,
} from "@/lib/onboarding/constants";

export type OrganizationActionState = {
  error?: string;
  organizationId?: string;
  programName?: string;
};

export type TeamActionState = {
  error?: string;
  teamName?: string;
};

function getRequiredString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value.trim();
}

export async function createOrganization(
  _prevState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const programName = getRequiredString(formData, "name");
  const city = getRequiredString(formData, "city");
  const state = getRequiredString(formData, "state");

  if (!programName || !city || !state) {
    return { error: "Program name, city, and state are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create an organization." };
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      user_id: user.id,
      name: programName,
      city,
      state: state.toUpperCase(),
    })
    .select("id, name")
    .single();

  if (error) {
    return { error: error.message };
  }

  return {
    organizationId: data.id,
    programName: data.name,
  };
}

export async function createTeam(
  _prevState: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const organizationId = getRequiredString(formData, "organization_id");
  const teamName = getRequiredString(formData, "team_name");
  const ageGroup = getRequiredString(formData, "age_group");
  const travelRadiusRaw = formData.get("travel_radius_miles");
  const playLevels = formData
    .getAll("play_level")
    .filter((value): value is string => typeof value === "string");

  if (!organizationId || !teamName || !ageGroup) {
    return { error: "Team name and age group are required." };
  }

  if (!AGE_GROUPS.includes(ageGroup as AgeGroup)) {
    return { error: "Select a valid age group." };
  }

  const validPlayLevels = playLevels.filter((level): level is PlayLevel =>
    PLAY_LEVELS.includes(level as PlayLevel),
  );

  if (validPlayLevels.length === 0) {
    return { error: "Select at least one play level." };
  }

  let travelRadius = 100;
  if (typeof travelRadiusRaw === "string" && travelRadiusRaw.trim() !== "") {
    travelRadius = Number(travelRadiusRaw);
    if (!Number.isFinite(travelRadius) || travelRadius < 1) {
      return { error: "Travel radius must be a positive number." };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a team." };
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", organizationId)
    .eq("user_id", user.id)
    .single();

  if (organizationError || !organization) {
    return { error: "Organization not found." };
  }

  const { error } = await supabase.from("teams").insert({
    organization_id: organizationId,
    name: teamName,
    age_group: ageGroup,
    play_level: validPlayLevels,
    travel_radius_miles: Math.round(travelRadius),
  });

  if (error) {
    return { error: error.message };
  }

  return { teamName };
}
