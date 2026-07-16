import { ChevronLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, spacing } from "@/src/constants/theme";

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
  style?: ViewStyle;
}

export default function PageHeader({ title, onBack, right, style }: PageHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <Pressable style={styles.backBtn} onPress={onBack} hitSlop={8}>
        <ChevronLeft color={colors.text.primary} size={22} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.rightSlot}>
        {right ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

interface HeaderIconBtnProps {
  onPress: () => void;
  children: ReactNode;
  danger?: boolean;
  hitSlop?: number;
}

export function HeaderIconBtn({ onPress, children, danger = false, hitSlop = 6 }: HeaderIconBtnProps) {
  return (
    <Pressable
      style={[styles.iconBtn, danger && styles.iconBtnDanger]}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      {children}
    </Pressable>
  );
}

export function HeaderActions({ children }: { children: ReactNode }) {
  return <View style={styles.actionsRow}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.faint,
    backgroundColor: colors.background.screen,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },
  rightSlot: {
    flexShrink: 0,
    alignItems: "flex-end",
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  iconBtnDanger: {
    backgroundColor: colors.danger.background,
    borderColor: colors.danger.border,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
});
