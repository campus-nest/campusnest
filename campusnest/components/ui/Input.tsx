import { Platform, Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
}

export default function Input({ label, style, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-cn-text-primary text-sm font-medium">{label}</Text>
      )}
      <TextInput
        className="bg-cn-card rounded-xl p-4 text-cn-text-primary text-base border border-cn-border"
        placeholderTextColor="#666"
        style={[
          { fontFamily: Platform.OS === "ios" ? "System" : "sans-serif" },
          style,
        ]}
        {...props}
      />
    </View>
  );
}
