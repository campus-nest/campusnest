import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  variant?: "dark" | "light";
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

export default function Card({ children, variant = "dark", style, className = "" }: CardProps) {
  const baseClasses = "rounded-[24px] p-4";
  const variantClasses = variant === "light" ? "bg-[#f2f2f2]" : "bg-[#1a1a1a]";

  return (
    <View
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}
