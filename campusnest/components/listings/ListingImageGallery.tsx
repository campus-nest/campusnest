import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Gallery height and padding — matches the paddingHorizontal: 20 of the content below
const H_PAD = 20;
const GALLERY_WIDTH = SCREEN_WIDTH - H_PAD * 2;
const MAIN_HEIGHT = 220;
const THUMB_HEIGHT = (MAIN_HEIGHT - 8) / 2; // two thumbs + 8px gap between them
const MAIN_WIDTH = GALLERY_WIDTH * 0.63;
const THUMB_WIDTH = GALLERY_WIDTH - MAIN_WIDTH - 8; // 8px gap

interface Props {
  photos: string[];
}

export function ListingImageGallery({ photos }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openViewer = (index: number) => {
    setActiveIndex(index);
    setVisible(true);
  };

  if (!photos.length) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>🏠</Text>
        <Text style={styles.placeholderText}>No photos available</Text>
      </View>
    );
  }

  // Single photo — full width
  if (photos.length === 1) {
    return (
      <>
        <Pressable style={styles.singleWrapper} onPress={() => openViewer(0)}>
          <Image source={{ uri: photos[0] }} style={styles.singleImage} resizeMode="cover" />
        </Pressable>
        <Viewer visible={visible} photos={photos} index={activeIndex} onClose={() => setVisible(false)} />
      </>
    );
  }

  return (
    <>
      <View style={styles.grid}>
        {/* Main large image */}
        <Pressable
          style={[styles.mainImage, { width: MAIN_WIDTH, height: MAIN_HEIGHT }]}
          onPress={() => openViewer(0)}
        >
          <Image source={{ uri: photos[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        </Pressable>

        {/* Side column */}
        <View style={[styles.sideColumn, { width: THUMB_WIDTH }]}>
          {/* Top thumbnail */}
          <Pressable
            style={[styles.thumbImage, { height: THUMB_HEIGHT }]}
            onPress={() => openViewer(1)}
          >
            <Image source={{ uri: photos[1] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          </Pressable>

          {/* Bottom thumbnail — shows count overlay if more photos */}
          <Pressable
            style={[styles.thumbImage, { height: THUMB_HEIGHT }]}
            onPress={() => openViewer(photos.length > 3 ? 2 : 2)}
          >
            {photos[2] ? (
              <Image source={{ uri: photos[2] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <View style={styles.emptyThumb} />
            )}
            {photos.length > 3 && (
              <View style={styles.countOverlay}>
                <Text style={styles.countText}>+{photos.length - 3}</Text>
                <Text style={styles.countSub}>more</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Viewer visible={visible} photos={photos} index={activeIndex} onClose={() => setVisible(false)} />
    </>
  );
}

function Viewer({
  visible,
  photos,
  index,
  onClose,
}: {
  visible: boolean;
  photos: string[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={viewer.container}>
        <FlatList
          data={photos}
          horizontal
          pagingEnabled
          initialScrollIndex={index}
          keyExtractor={(item, i) => `${item}-${i}`}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, i) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              resizeMode="contain"
            />
          )}
        />
        <SafeAreaView style={viewer.closeWrapper}>
          <Pressable style={viewer.closeBtn} onPress={onClose} hitSlop={12}>
            <Text style={viewer.closeText}>✕</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    marginHorizontal: H_PAD,
    height: MAIN_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 4,
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  placeholderText: {
    color: "#555",
    fontSize: 12,
  },
  singleWrapper: {
    marginHorizontal: H_PAD,
    height: MAIN_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    marginBottom: 4,
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  grid: {
    flexDirection: "row",
    marginHorizontal: H_PAD,
    gap: 8,
    marginBottom: 4,
  },
  mainImage: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  sideColumn: {
    gap: 8,
  },
  thumbImage: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    flex: 1,
  },
  emptyThumb: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  countOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  countText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  countSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
});

const viewer = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  closeBtn: {
    margin: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  closeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});