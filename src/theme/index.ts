import { DarkTheme, type Theme } from "@react-navigation/native";

export const colors = {
  black: "#0A0A0A",
  charcoal: "#161616",
  panel: "rgba(22, 22, 22, 0.82)",
  panelStrong: "#1E1E1E",
  line: "rgba(255, 255, 255, 0.09)",
  orange: "#FF7A1A",
  orangeSoft: "rgba(255, 122, 26, 0.18)",
  white: "#F5F5F5",
  muted: "#B7B7B7",
  dim: "#747474",
  success: "#33D17A",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 8,
};

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800" as const,
    letterSpacing: 0,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800" as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500" as const,
    letterSpacing: 0,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
};

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.black,
    card: colors.black,
    primary: colors.orange,
    text: colors.white,
    border: colors.line,
    notification: colors.orange,
  },
};
