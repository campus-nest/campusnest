import React, { useState } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

const { width } = Dimensions.get("window");

type Props = {
  photos: string[];
  onRemove: (uri: string) => void;
};

export function ImagePickerPreview({ photos, onRemove }: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <View style={styles.grid}>
        {photos.map((uri) => (
          <View key={uri} style={styles.imageWrapper}>
            <Pressable onPress={() => setViewerIndex(photos.indexOf(uri))}>
              <Image source={{ uri }} style={styles.image} />
            </Pressable>

            <Pressable
              style={styles.removeButton}
              onPress={() => onRemove(uri)}
            >
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Full screen viewer */}
      <Modal visible={viewerIndex !== null} transparent>
        <FlatList
          horizontal
          pagingEnabled
          initialScrollIndex={viewerIndex ?? 0}
          data={photos}
          keyExtractor={(u) => u}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.fullImage} />
          )}
        />

        <Pressable
          style={styles.closeViewer}
          onPress={() => setViewerIndex(null)}
        >
          <Text style={{ color: colors.white, fontSize: 24 }}>✕</Text>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.black,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: colors.white,
    fontSize: typography.size.md,
    lineHeight: 14,
  },
  fullImage: {
    width,
    height: "100%",
    resizeMode: "contain",
    backgroundColor: colors.black,
  },
  closeViewer: {
    position: "absolute",
    top: 50,
    right: spacing.xl,
  },
});
