import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/src/constants/theme";

interface LoadingStateProps {
  label?: string;
  showSpinner?: boolean;
}

export default function LoadingState({
  label,
  showSpinner = true,
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      {showSpinner && <ActivityIndicator color={colors.text.primary} size="large" />}
      {label && <Text style={styles.text}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.screen,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  text: {
    color: colors.text.muted,
    fontSize: 14,
    textAlign: "center",
  },
});
