import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** When true, wraps children in a ScrollView */
  scrollable?: boolean;
  /** Additional style applied to the inner ScrollView's contentContainer */
  contentContainerStyle?: ViewStyle;
  /** Pass to suppress the default horizontal padding (e.g. for full-bleed map/image screens) */
  noPadding?: boolean;
}

export default function Screen({
  children,
  style,
  scrollable = false,
  contentContainerStyle,
  noPadding = false,
}: ScreenProps) {
  const paddingStyle: ViewStyle = noPadding ? {} : { paddingHorizontal: 20 };

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <StatusBar style="light" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            paddingStyle,
            { paddingBottom: 40 },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, paddingStyle, style]}>
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
