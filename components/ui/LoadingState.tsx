import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  label?: string;
  showSpinner?: boolean;
  className?: string;
}

export default function LoadingState({
  label,
  showSpinner = true,
  className = "",
}: LoadingStateProps) {
  return (
    <View className={`flex-1 bg-black items-center justify-center ${className}`}>
      {showSpinner && <ActivityIndicator color="#fff" />}
      {label && <Text className="text-white mt-2.5 text-center">{label}</Text>}
    </View>
  );
}
