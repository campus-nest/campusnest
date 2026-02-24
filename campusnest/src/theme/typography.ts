/**
 * CampusNest design token — typography
 */
export const typography = {
    fontSizes: {
        xs: 11,
        sm: 12,
        base: 13,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 22,
        h2: 24,
        h1: 32,
    },
    fontWeights: {
        regular: "400" as const,
        medium: "500" as const,
        semibold: "600" as const,
        bold: "700" as const,
    },
    lineHeights: {
        tight: 16,
        base: 19,
        relaxed: 24,
    },
} as const;
