import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageContainer } from "@/components/page-container";
import { postService, profileService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Profile } from "@/src/types/profile";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPostAndCreator = async () => {
      setLoading(true);

      const postData = await postService.getPostById(id);

      if (!postData) {
        console.error("Post not found");
        setLoading(false);
        return;
      }

      setPost(postData);

      // Fetch creator profile
      const creatorProfile = await profileService.getProfileById(
        postData.user_id,
      );
      setCreator(creatorProfile);

      setLoading(false);
    };

    fetchPostAndCreator();
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Post Content Card */}
          <View style={styles.postCard}>
            <Text style={styles.title}>{post.title}</Text>

            <Text style={styles.body}>{post.body}</Text>

            {/* Creator Info */}
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorLabel}>Posted by:</Text>
              <Text style={styles.creatorName}>
                {creator?.full_name || "Unknown User"}
              </Text>
              <Text style={styles.date}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  body: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creatorLabel: {
    color: "#999",
    fontSize: 12,
  },
  creatorName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  date: {
    color: "#999",
    fontSize: 11,
    marginLeft: "auto",
  },
});
