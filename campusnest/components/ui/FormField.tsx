import { ReactNode } from "react";
import { Text, View } from "react-native";

interface FormFieldProps {
    label: string;
    children: ReactNode;
}

/**
 * Consistent label + input wrapper used throughout all forms.
 */
export default function FormField({ label, children }: FormFieldProps) {
    return (
        <View className="mb-3">
            <Text className="text-cn-text-label text-[13px] mb-1">{label}</Text>
            {children}
        </View>
    );
}
