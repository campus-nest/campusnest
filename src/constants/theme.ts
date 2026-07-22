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
    faded: "#777",
    disabled: "#444",
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
    background: "#e3f2fd",
  },
  success: {
    default: "#4CAF50",
    background: "#e8f5e9",
    border: "#4CAF50",
    text: "#2e7d32",
  },
  danger: {
    default: "#ff4444",
    background: "#1a0a0a",
    border: "#3a1515",
    text: "#d32f2f",
  },
  map: {
    markerHighlightBorder: "#003366",
  },
  // Light-variant palette, used by form components rendered on white surfaces
  // (e.g. Card/Dropdown/Section/TabSelector/AddressInput with variant="light").
  light: {
    text: "#333",
    placeholder: "#777",
    surface: "#f2f2f2",
    border: "#ddd",
    borderSubtle: "#eee",
    divider: "#d0d0d0",
    chipBorder: "#bbb",
    chipBackground: "#e0e0e0",
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
  xxxxl: 40,
  huge: 48,
  massive: 60,
  giant: 80,
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
