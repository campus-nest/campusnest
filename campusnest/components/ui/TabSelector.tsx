import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface Tab {
  label: string;
  value: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: "dark" | "light";
  style?: ViewStyle;
}

export default function TabSelector({
  tabs,
  activeTab,
  onTabChange,
  variant = "dark",
  style,
}: TabSelectorProps) {
  const isLight = variant === "light";

  return (
    <View
      style={[
        styles.tabRow,
        isLight ? styles.tabRowLight : styles.tabRowDark,
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                isLight ? styles.tabTextLight : styles.tabTextDark,
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    borderRadius: radius.full,
    padding: spacing.xs,
  },
  tabRowDark: {
    backgroundColor: colors.border.strong,
  },
  tabRowLight: {
    backgroundColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  tabTextDark: {
    color: colors.text.muted,
  },
  tabTextLight: {
    color: colors.text.dim,
  },
  tabTextActive: {
    color: colors.black,
  },
});
