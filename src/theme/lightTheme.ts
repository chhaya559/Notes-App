export const LightColors = {
  // =========================
  // BACKGROUND SYSTEM
  // =========================

  background: "#F8FAFF", // main app background (clean, premium)
  backgroundSecondary: "#EEF2FF", // greeting area gradient support
  surface: "#FFFFFF", // cards, sheets
  surfaceHover: "#F1F5FF", // pressed card
  surfaceSoft: "#F8FAFC", // subtle containers
  surfaceAccent: "#EEF2FF", // highlighted container

  // =========================
  // BRAND SYSTEM
  // =========================

  primary: "#6366F1", // main brand (modern indigo)
  primaryHover: "#5855EB",
  primaryPressed: "#4F46E5",

  primarySoft: "#EEF2FF", // soft bg
  primaryBorder: "#C7D2FE",

  gradientStart: "#6366F1", // FAB / Hero gradient
  gradientEnd: "#8B5CF6",

  // =========================
  // TEXT SYSTEM
  // =========================

  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textOnPrimary: "#FFFFFF",

  // =========================
  // BORDER SYSTEM
  // =========================

  borderLight: "#E2E8F0",
  border: "#CBD5E1",
  divider: "#EEF2F7",
  profile: "#ffffffff",

  // =========================
  // ICON SYSTEM
  // =========================

  iconPrimary: "#6366F1",
  iconSecondary: "#64748B",
  iconMuted: "#94A3B8",

  iconOnPrimary: "#FFFFFF",

  iconSoftBg: "#EEF2FF",

  // =========================
  // FAB
  // =========================

  fab: "#6366F1",
  fabIcon: "#FFFFFF",

  // =========================
  // INPUT
  // =========================

  inputBackground: "#FFFFFF",
  inputBorder: "#CBD5E1",
  inputFocusBorder: "#6366F1",
  placeholder: "#94A3B8",
  swipeLockBg: "#c2c8ffff",
  swipeDeleteBg: "#ffb6b6ff",
  // =========================
  // STATUS
  // =========================

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",

  successSoft: "#ECFDF5",
  dangerSoft: "#FEF2F2",

  // =========================
  // SPECIAL
  // =========================

  lockBg: "#EEF2FF",
  deleteBg: "#FEF2F2",

  // =========================
  // SHADOW
  // =========================

  shadowPrimary: "rgba(99,102,241,0.18)",
  shadowSoft: "rgba(15,23,42,0.06)",
};

export type DefaultColorType = typeof LightColors;
