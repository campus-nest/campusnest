import { StyleSheet, Text, TextStyle } from "react-native";
import { colors, typography } from "@/src/constants/theme";

interface HeadingProps {
  children: React.ReactNode;
  style?: TextStyle;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export function H1({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      style={[
        styles.h1,
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function H2({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      style={[
        styles.h2,
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function H3({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      style={[
        styles.h3,
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function H4({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      style={[
        styles.h4,
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    color: colors.text.primary,
    fontSize: typography.size.display,
    fontWeight: typography.weight.medium,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h2: {
    color: colors.text.primary,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.medium,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h3: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h4: {
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  bold: {
    fontWeight: typography.weight.bold,
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
