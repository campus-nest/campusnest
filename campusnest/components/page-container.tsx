import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface PageContainerProps extends ViewProps {
  children: ReactNode;
}

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <View 
        className={cn("w-[70%] max-w-[1000px] flex-1", className)} 
        {...props}
      >
        {children}
      </View>
    </View>
  );
}
