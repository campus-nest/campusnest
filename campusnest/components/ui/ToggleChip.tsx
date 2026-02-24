import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { Pressable, StyleSheet, Text } from "react-native";

interface ToggleChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

/**
 * A pill-shaped toggle chip — selected/unselected state.
 * Used for utility pills, Furnished/Unfurnished, and similar selectors.
 */
export default function ToggleChip({ label, selected, onPress }: ToggleChipProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.chip, selected && styles.chipSelected]}
        >
            <Text style={[styles.text, selected && styles.textSelected]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm - 2,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.chipBorder,
        backgroundColor: colors.chipBackground,
    },
    chipSelected: {
        backgroundColor: colors.chipSelected,
        borderColor: colors.chipSelectedBorder,
    },
    text: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSubtle,
    },
    textSelected: {
        color: colors.textPrimary,
    },
});
