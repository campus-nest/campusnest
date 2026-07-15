import React, { ReactNode } from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  label: string;
  subtext?: string;
  icon?: ReactNode;
  className?: string;
}

export default function EmptyState({ label, subtext, icon, className = "" }: EmptyStateProps) {
  return (
    <View className={`flex-1 justify-center items-center gap-3 px-8 pb-[60px] min-h-[250px] ${className}`}>
      {icon && (
        <View className="w-16 h-16 rounded-[20px] bg-[#111] border border-[#1e1e1e] items-center justify-center mb-1">
          {icon}
        </View>
      )}
      <Text className="text-white text-[18px] font-semibold text-center">{label}</Text>
      {subtext && (
        <Text className="text-[#555] text-[14px] text-center leading-[20px]">{subtext}</Text>
      )}
    </View>
  );
}
