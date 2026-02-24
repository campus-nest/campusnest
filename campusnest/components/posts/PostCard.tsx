import { Post } from "@/src/types/post";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  post: Post;
  saved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

export default function PostCard({ post, saved, onPress, onToggleSave }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{post.title}</Text>

      <Text style={styles.body} numberOfLines={4}>
        {post.body}
      </Text>

      <View style={styles.actions}>
        <Pressable onPress={onToggleSave}>
          <Text style={styles.heart}>{saved ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  heart: {
    fontSize: 20,
  },
});