import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageContainer } from "@/components/page-container";
import { postService } from "@/src/services";
import { Post } from "@/src/types/post";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);

      const postData = await postService.getPostById(id);

      if (!postData) {
        console.error("Post not found");
        setLoading(false);
        return;
      }

      setPost(postData);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading || !post) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading post...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.title}>{post.title}</Text>

        <Text style={styles.date}>
          {new Date(post.created_at).toLocaleString()}
        </Text>

        <Text style={styles.body}>{post.body}</Text>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
  },
  container: {
    padding: 16,
  },
  back: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  date: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 12,
  },
  body: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
});
