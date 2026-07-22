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
import { colors, radius, spacing, typography } from "@/src/constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const H_PAD = spacing.xl; // 20 — matches paddingHorizontal of surrounding content
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
    borderRadius: radius.md,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  placeholderText: {
    color: colors.text.dim,
    fontSize: typography.size.sm,
  },
  singleWrapper: {
    marginHorizontal: H_PAD,
    height: MAIN_HEIGHT,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.background.elevated,
    marginBottom: spacing.xs,
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  grid: {
    flexDirection: "row",
    marginHorizontal: H_PAD,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  mainImage: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.background.elevated,
  },
  sideColumn: {
    gap: spacing.sm,
  },
  thumbImage: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.background.elevated,
    flex: 1,
  },
  emptyThumb: {
    flex: 1,
    backgroundColor: colors.background.elevated,
  },
  countOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  countText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: typography.weight.bold,
    lineHeight: 26,
  },
  countSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});

const viewer = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  closeWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  closeBtn: {
    margin: spacing.lg,
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
    color: colors.white,
    fontSize: 15,
    fontWeight: typography.weight.semibold,
  },
});