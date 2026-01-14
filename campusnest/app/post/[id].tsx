import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabaseClient";
import { PageContainer } from "@/components/page-container";

type Post = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
};

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Post fetch error:", error);
        setLoading(false);
        return;
      }

      setPost(data as Post);
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
