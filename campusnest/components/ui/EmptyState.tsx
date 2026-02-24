import { Text, View } from "react-native";

interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
}

/**
 * Reusable empty / zero-state placeholder.
 */
export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-8">
            {icon && <Text className="text-6xl mb-4">{icon}</Text>}
            <Text className="text-cn-text-primary text-xl font-semibold mb-2 text-center">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-cn-text-muted text-sm text-center">{subtitle}</Text>
            )}
        </View>
    );
}
