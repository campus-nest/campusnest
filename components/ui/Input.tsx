import {
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  containerClassName?: string;
  labelStyle?: TextStyle | TextStyle[];
  labelClassName?: string;
}

export default function Input({
  label,
  containerStyle,
  containerClassName = "",
  className = "",
  style,
  labelStyle,
  labelClassName = "",
  ...props
}: InputProps) {
  return (
    <View className={`gap-2 ${containerClassName}`} style={containerStyle}>
      {label && <Text className={`text-white text-[14px] font-medium ${labelClassName}`} style={labelStyle}>{label}</Text>}
      <TextInput
        className={`bg-[#1a1a1a] rounded-[12px] p-4 text-white text-[16px] border border-[#333] tracking-[0px] ${className}`}
        style={style}
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
}
