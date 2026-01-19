import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

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
    borderRadius: 999,
    padding: 4,
  },
  tabRowDark: {
    backgroundColor: "#333",
  },
  tabRowLight: {
    backgroundColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextDark: {
    color: "#aaa",
  },
  tabTextLight: {
    color: "#555",
  },
  tabTextActive: {
    color: "#000",
  },
});