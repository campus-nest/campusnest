import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/constants/theme";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  noPadding?: boolean;
}

export default function Screen({
  children,
  style,
  scrollable = false,
  contentContainerStyle,
  noPadding = false,
}: ScreenProps) {
  const hPad: ViewStyle = noPadding ? {} : { paddingHorizontal: spacing.xl };

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <StatusBar style="light" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            hPad,
            styles.scrollBase,
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, hPad, style]}>
      <StatusBar style="light" />
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  scrollBase: {
    paddingTop: spacing.xxxl,
    paddingBottom: 48,
    gap: 0,
  },
  inner: {
    flex: 1,
  },
});
