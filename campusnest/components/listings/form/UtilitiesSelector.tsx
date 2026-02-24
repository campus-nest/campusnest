import ToggleChip from "@/components/ui/ToggleChip";
import { StyleSheet, View } from "react-native";

export type Utilities = {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    heating: boolean;
    wifi: boolean;
    heat: boolean;
};

const UTILITY_KEYS: (keyof Utilities)[] = [
    "electricity",
    "water",
    "wifi",
    "heat",
];

const UTILITY_LABELS: Record<keyof Utilities, string> = {
    electricity: "Electricity",
    water: "Water",
    internet: "Internet",
    heating: "Heating",
    wifi: "Wifi",
    heat: "Heat",
};

interface UtilitiesSelectorProps {
    value: Utilities;
    onChange: (value: Utilities) => void;
}

export const DEFAULT_UTILITIES: Utilities = {
    electricity: false,
    water: false,
    internet: false,
    heating: false,
    wifi: false,
    heat: false,
};

export default function UtilitiesSelector({
    value,
    onChange,
}: UtilitiesSelectorProps) {
    return (
        <View style={styles.grid}>
            {UTILITY_KEYS.map((key) => (
                <ToggleChip
                    key={key}
                    label={UTILITY_LABELS[key]}
                    selected={value[key]}
                    onPress={() => onChange({ ...value, [key]: !value[key] })}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
});
