import { Pressable, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  small: "w-[120px] h-10",
  medium: "w-[152px] h-12",
  large: "w-[200px] h-14",
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-cn-white",
  secondary: "bg-[#333]",
  outline: "bg-transparent border border-cn-text-primary",
};

const textVariantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-cn-text-dark",
  secondary: "text-cn-text-primary",
  outline: "text-cn-text-primary",
};

export default function Button({
  onPress,
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      className={[
        "rounded-full items-center justify-center",
        variantClasses[variant],
        fullWidth ? "w-full" : sizeClasses[size],
        disabled ? "opacity-50" : "",
      ].join(" ")}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        className={[
          "text-sm font-medium tracking-tight",
          textVariantClasses[variant],
          disabled ? "text-cn-text-muted" : "",
        ].join(" ")}
      >
        {children}
      </Text>
    </Pressable>
  );
}
