export const LightColors = {
  // Background Layer

  background: "#e6eaf4ff", // Soft cool gray background
  surface: "#FFFFFF", // Main card surface
  surfaceSoft: "#FAFBFF", // Slightly tinted container
  emptyContainer: "#f5f5f5", // Subtle lavender tint

  // Primary Brand

  primary: "#6C63FF", // Slightly deeper than dark primary
  primarySoft: "#E9E7FF", // Soft brand background
  primaryPressed: "#5A52E0", // Darker press feedback
  primaryBorder: "#D9D6FF", // Soft border tint

  // Text Hierarchy

  textPrimary: "#0F172A", // Deep slate (better than pure black)
  textSecondary: "#475569", // Cool gray
  textMuted: "#94A3B8", // Muted text
  placeholder: "#9CA3AF", // Input placeholder
  buttonText: "#FFFFFF", // White on primary buttons

  // Borders & Dividers

  border: "#b6b6b7ff", // Soft gray border
  divider: "#ECEFF5", // Subtle divider

  // Icons

  buttonIcon: "#FFFFFF", // Keep white on primary button
  icon: "#3f4494ff", // Soft indigo (brand-aligned)
  mutedIcon: "#9AA1D3", // Light indigo-gray
  iconSoftBg: "#E8EBFF", // Very soft lavender bg

  // Swipe Actions

  swipeLockBg: "#c5d1f9ff", // Light indigo background
  swipeLockIcon: "#6C63FF",

  swipeDeleteBg: "#FEE2E2", // Light red background
  swipeDeleteIcon: "#DC2626",

  // Status

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",

  // Shadows

  shadowLight: "rgba(108,99,255,0.08)",
  shadowMedium: "rgba(108,99,255,0.15)",

  primaryGradient: ["#8B80FF", "#6C63FF"],
};

export type DefaultColorType = typeof LightColors;
