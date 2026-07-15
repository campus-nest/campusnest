import { Pressable, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  onPress,
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const baseClasses = "rounded-full justify-center items-center";
  
  const variantClasses = {
    primary: "bg-white",
    secondary: "bg-[#333]",
    outline: "bg-transparent border border-white",
  }[variant];

  const sizeClasses = {
    small: "w-[120px] h-[40px]",
    medium: "w-[152px] h-[48px]",
    large: "w-[200px] h-[56px]",
  }[size];

  const widthClass = fullWidth ? "w-full" : sizeClasses;
  const disabledClass = disabled ? "opacity-50" : "";

  const baseTextClasses = "text-[14px] font-medium tracking-[0.1px]";
  
  const textVariantClasses = {
    primary: "text-black",
    secondary: "text-white",
    outline: "text-white",
  }[variant];

  const textDisabledClass = disabled ? "text-[#999]" : textVariantClasses;

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses} ${widthClass} ${disabledClass}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`${baseTextClasses} ${textDisabledClass}`}>
        {children}
      </Text>
    </Pressable>
  );
}
