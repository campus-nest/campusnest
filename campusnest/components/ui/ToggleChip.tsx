import { Pressable, Text } from "react-native";

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
            className={[
                "px-3 py-1.5 rounded-full border",
                selected
                    ? "bg-cn-text-dark border-cn-text-dark"
                    : "bg-cn-white border-cn-border-muted",
            ].join(" ")}
        >
            <Text
                className={[
                    "text-xs",
                    selected ? "text-cn-text-primary" : "text-cn-text-subtle",
                ].join(" ")}
            >
                {label}
            </Text>
        </Pressable>
    );
}
