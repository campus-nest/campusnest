import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageContainerProps extends ViewProps {
  children: ReactNode;
}

export function PageContainer({
  children,
  style,
  ...props
}: PageContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    width: "100%", // full width
    paddingHorizontal: 20, // consistent mobile padding
    paddingTop: 10,
  },
});
