export const AGE_GROUPS = [
  "8U",
  "9U",
  "10U",
  "11U",
  "12U",
  "13U",
  "14U",
  "15U",
  "16U",
  "17U",
  "18U",
] as const;

export const PLAY_LEVELS = [
  "Rec",
  "A",
  "AA",
  "AAA",
  "Major",
  "D1",
  "D2",
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];
export type PlayLevel = (typeof PLAY_LEVELS)[number];

export const ONBOARDING_STEPS = 3;
