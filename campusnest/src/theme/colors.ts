/**
 * CampusNest design token — colors
 * All raw hex values should come from here; never hard-code in components.
 */
export const colors = {
    // Backgrounds
    background: "#000000",
    backgroundCard: "#1a1a1a",
    backgroundCardAlt: "#2a2a2a",
    backgroundDark: "#27272a",
    backgroundSurface: "#3f3f46",
    backgroundLight: "#f2f2f2",
    backgroundWhite: "#ffffff",
    backgroundInput: "#1a1a1a",
    backgroundInputLight: "#ffffff",
    backgroundMuted: "#e0e0e0",

    // Text
    textPrimary: "#ffffff",
    textSecondary: "#aaaaaa",
    textMuted: "#999999",
    textDim: "#777777",
    textDark: "#000000",
    textLabel: "#dddddd",
    textSubtle: "#555555",
    textPlaceholder: "#666666",

    // Borders
    border: "#333333",
    borderLight: "#dddddd",
    borderMuted: "#bbbbbb",

    // Brand
    accent: "#3b82f6",

    // Chips / Toggles
    chipBackground: "#ffffff",
    chipSelected: "#000000",
    chipBorder: "#bbbbbb",
    chipSelectedBorder: "#000000",
    chipTextSelected: "#ffffff",

    // Utility chip
    utilityBackground: "#ffffff",
    utilitySelected: "#000000",
    utilityBorder: "#bbbbbb",
} as const;

export type ColorKey = keyof typeof colors;
