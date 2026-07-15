import { StatusBar } from "expo-status-bar";
import { ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle | ViewStyle[];
  contentContainerClassName?: string;
  noPadding?: boolean;
}

export default function Screen({
  children,
  style,
  className = "",
  scrollable = false,
  contentContainerStyle,
  contentContainerClassName = "",
  noPadding = false,
}: ScreenProps) {
  const paddingClass = noPadding ? "" : "px-6"; // px-6 is 24px

  if (scrollable) {
    return (
      <SafeAreaView className={`flex-1 bg-black ${className}`} style={style}>
        <StatusBar style="light" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={`${paddingClass} pt-[32px] pb-[48px] ${contentContainerClassName}`}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-black ${paddingClass} ${className}`} style={style}>
      <StatusBar style="light" />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}