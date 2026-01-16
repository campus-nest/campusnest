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
          <Text style={{ color: "#fff", fontSize: 24 }}>✕</Text>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#000",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 14,
  },
  fullImage: {
    width,
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "#000",
  },
  closeViewer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
