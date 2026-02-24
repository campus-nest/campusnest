import ToggleChip from "@/components/ui/ToggleChip";
import { StyleSheet, View } from "react-native";

interface FurnishedToggleProps {
    value: boolean | null;
    onChange: (value: boolean) => void;
}

/**
 * Furnished / Unfurnished two-chip toggle row.
 */
export default function FurnishedToggle({
    value,
    onChange,
}: FurnishedToggleProps) {
    return (
        <View style={styles.row}>
            <ToggleChip
                label="Furnished"
                selected={value === true}
                onPress={() => onChange(true)}
            />
            <ToggleChip
                label="Unfurnished"
                selected={value === false}
                onPress={() => onChange(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        marginBottom: 16,
    },
});
