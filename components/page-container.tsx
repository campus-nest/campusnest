import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageContainerProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  style,
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className={`flex-1 w-full px-2 ${className}`} style={style} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
