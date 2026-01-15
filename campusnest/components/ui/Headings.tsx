import { StyleSheet, Text, TextStyle } from "react-native";

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
    color: "#fff",
    fontSize: 32,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h2: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h3: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  h4: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecorationLine: "underline",
  },
});