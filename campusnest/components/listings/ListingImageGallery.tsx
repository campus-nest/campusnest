import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  photos: string[];
}

export function ListingImageGallery({ photos }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos.length) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>🏠</Text>
      </View>
    );
  }

  return (
    <>
      {/* Preview grid */}
      <View style={styles.previewRow}>
        <Pressable
          style={styles.mainImageWrapper}
          onPress={() => {
            setActiveIndex(0);
            setVisible(true);
          }}
        >
          <Image
            source={{ uri: photos[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.sideImages}>
          {photos.slice(1, 3).map((uri, idx) => (
            <Pressable
              key={uri}
              onPress={() => {
                setActiveIndex(idx + 1);
                setVisible(true);
              }}
            >
              <Image source={{ uri }} style={styles.sideImage} />
            </Pressable>
          ))}

          {photos.length > 3 && (
            <Pressable
              style={styles.moreOverlay}
              onPress={() => {
                setActiveIndex(3);
                setVisible(true);
              }}
            >
              <Text style={styles.moreText}>+{photos.length - 3} more</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Full-screen viewer */}
      <Modal visible={visible} transparent>
        <View style={styles.modalContainer}>
          <FlatList
            data={photos}
            horizontal
            pagingEnabled
            initialScrollIndex={activeIndex}
            keyExtractor={(item, index) => `${item}-${index}`}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          />

          <Pressable
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  previewRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  mainImageWrapper: {
    width: "65%",
    height: 160,
    borderRadius: 16,
    marginRight: 8,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  sideImages: {
    width: "35%",
    justifyContent: "space-between",
  },
  sideImage: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    marginBottom: 6,
  },
  moreOverlay: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  placeholder: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  closeText: {
    color: "#fff",
    fontSize: 28,
  },
});
