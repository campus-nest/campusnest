export const colors = {
  background: {
    screen: "#000",
    card: "#111",
    elevated: "#1a1a1a",
    surface: "#2a2a2a",
    modal: "#121212",
  },
  text: {
    primary: "#fff",
    secondary: "#888",
    muted: "#aaa",
    dim: "#555",
    faint: "#666",
    value: "#e0e0e0",
    body: "#ccc",
    subtle: "#bbb",
    readable: "#999",
  },
  border: {
    strong: "#333",
    default: "#2a2a2a",
    subtle: "#1e1e1e",
    faint: "#1a1a1a",
    dim: "#222",
  },
  accent: {
    primary: "#007AFF",
    secondary: "#0066CC",
  },
  danger: {
    default: "#ff4444",
    background: "#1a0a0a",
    border: "#3a1515",
  },
  white: "#fff",
  black: "#000",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const typography = {
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
} as const;
