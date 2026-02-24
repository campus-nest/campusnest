import { Text, TextStyle } from "react-native";

interface HeadingProps {
  children: React.ReactNode;
  style?: TextStyle;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

function buildModifiers(bold?: boolean, italic?: boolean, underline?: boolean) {
  return [
    bold ? "font-bold" : "",
    italic ? "italic" : "",
    underline ? "underline" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function H1({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      className={`text-cn-text-primary text-[32px] font-medium text-center tracking-tight ${buildModifiers(bold, italic, underline)}`}
      style={style}
    >
      {children}
    </Text>
  );
}

export function H2({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      className={`text-cn-text-primary text-2xl font-medium text-center tracking-tight ${buildModifiers(bold, italic, underline)}`}
      style={style}
    >
      {children}
    </Text>
  );
}

export function H3({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      className={`text-cn-text-primary text-sm font-medium text-center tracking-tight ${buildModifiers(bold, italic, underline)}`}
      style={style}
    >
      {children}
    </Text>
  );
}

export function H4({ children, style, bold, italic, underline }: HeadingProps) {
  return (
    <Text
      className={`text-cn-text-primary text-xs font-normal text-center tracking-tight ${buildModifiers(bold, italic, underline)}`}
      style={style}
    >
      {children}
    </Text>
  );
}
