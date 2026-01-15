import { Pressable, StyleSheet, Text, Platform } from "react-native";
import { useRouter } from "expo-router";

interface BackButtonProps {
  top?: number;
  left?: number;
}

export default function BackButton({
  top = 60,
  left = 20,
}: BackButtonProps) {
  const router = useRouter();

  // Android-only coz iOS native back gesture
  if (Platform.OS !== "android") return null;

  return (
    <Pressable
      style={[styles.button, { top, left }]}
      onPress={() => router.back()}
      hitSlop={10}
    >
      <Text style={styles.text}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
  },
});
