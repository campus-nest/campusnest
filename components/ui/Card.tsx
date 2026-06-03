import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export default function Card({ children, variant = "dark", style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === "light" ? styles.cardLight : styles.cardDark,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
  },
  cardDark: {
    backgroundColor: "#1a1a1a",
  },
  cardLight: {
    backgroundColor: "#f2f2f2",
  },
});
