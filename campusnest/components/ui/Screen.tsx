import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ViewStyle } from "react-native";
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
    <Container style={[styles.container, style]}>
      <StatusBar style="light" />
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignContent: "center",
    gap: 15,
    padding: 50,
  },
});

