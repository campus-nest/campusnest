import { StatusBar } from "expo-status-bar";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
}

export default function Screen({
  children,
  style,
  useSafeArea = false,
}: ScreenProps) {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container
      className="flex-1 bg-cn-bg justify-center items-center gap-[15px] p-[50px]"
      style={style}
    >
      <StatusBar style="light" />
      {children}
    </Container>
  );
}
