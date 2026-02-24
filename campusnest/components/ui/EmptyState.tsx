import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
}

/**
 * Reusable empty / zero-state placeholder.
 * Replaces inline empty-state JSX in saved.tsx, users.tsx, etc.
 */
export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xxl,
    },
    icon: {
        fontSize: 64,
        marginBottom: spacing.base,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
        textAlign: "center",
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: typography.fontSizes.md,
        textAlign: "center",
    },
});
