import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";

interface MoveInDatePickerProps {
    value: Date | null;
    onChange: (date: Date) => void;
}

/**
 * Pressable date display + DateTimePicker sheet.
 */
export default function MoveInDatePicker({
    value,
    onChange,
}: MoveInDatePickerProps) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <>
            <Pressable style={styles.dropdown} onPress={() => setShowPicker(true)}>
                <Text style={styles.text}>
                    {value ? value.toLocaleDateString() : "Select move in date"}
                </Text>
                <Text style={styles.icon}>📅</Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) onChange(selectedDate);
                    }}
                />
            )}
        </>
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
    icon: {
        fontSize: typography.fontSizes.md,
    },
});
