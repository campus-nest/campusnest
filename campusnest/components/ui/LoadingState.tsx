import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  label: string;
  showSpinner?: boolean;
}

/**
 * Full-screen loading / error placeholder.
 */
export default function LoadingState({
  label,
  showSpinner = true,
}: LoadingStateProps) {
  return (
    <View className="flex-1 bg-cn-bg items-center justify-center">
      {showSpinner && <ActivityIndicator color="#fff" />}
      {label ? (
        <Text className="text-cn-text-primary mt-2 text-center text-sm px-6">
          {label}
        </Text>
      ) : null}
    </View>
  );
}
