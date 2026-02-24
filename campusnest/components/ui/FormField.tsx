import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface FormFieldProps {
    label: string;
    children: ReactNode;
}

/**
 * Consistent label + input wrapper used throughout forms.
 * Keeps label style, spacing, and marginBottom uniform.
 */
export default function FormField({ label, children }: FormFieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        marginBottom: spacing.md,
    },
    label: {
        color: colors.textLabel,
        fontSize: typography.fontSizes.base,
        marginBottom: spacing.xs,
    },
});
