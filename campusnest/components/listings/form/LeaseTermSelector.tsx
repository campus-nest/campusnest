import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import { Pressable, StyleSheet, Text } from "react-native";

const LEASE_OPTIONS = ["4 months", "8 months", "12 months"] as const;
export type LeaseTermOption = (typeof LEASE_OPTIONS)[number];

interface LeaseTermSelectorProps {
    value: string | null;
    onChange: (value: string) => void;
}

/**
 * Cycles through fixed lease term options on press.
 */
export default function LeaseTermSelector({
    value,
    onChange,
}: LeaseTermSelectorProps) {
    const handlePress = () => {
        const idx = LEASE_OPTIONS.indexOf(value as LeaseTermOption);
        const next = LEASE_OPTIONS[(idx + 1) % LEASE_OPTIONS.length];
        onChange(next);
    };

    return (
        <Pressable style={styles.dropdown} onPress={handlePress}>
            <Text style={styles.text}>{value || "Select lease term"}</Text>
            <Text style={styles.chevron}>⌄</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.backgroundWhite,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 4,
    },
    text: {
        fontSize: typography.fontSizes.md,
        color: colors.textSubtle,
    },
    chevron: {
        fontSize: typography.fontSizes.md,
        color: colors.textSubtle,
    },
});
