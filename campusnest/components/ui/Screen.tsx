import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
}

/**
 * Renders a full-screen container for app content, optionally using SafeAreaView.
 *
 * The container applies the module's base screen styles and merges any custom
 * `style` passed in. When `useSafeArea` is true, the container will respect
 * device safe areas.
 *
 * @param children - React nodes to render inside the screen container
 * @param style - Optional additional style to merge with the default container styles
 * @param useSafeArea - If true, use SafeAreaView instead of View to respect device safe areas (default: false)
 * @returns The screen container element with merged styles and its children
 */
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
