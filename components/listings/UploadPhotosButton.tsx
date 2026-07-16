import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface UploadPhotosButtonProps {
  hasPhotos: boolean;
  onPress: () => void;
}

export default function UploadPhotosButton({ hasPhotos, onPress }: UploadPhotosButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{hasPhotos ? "Add more photos" : "Upload photos"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.md,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
    width: "100%",
  },
  text: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
});
