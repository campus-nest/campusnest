import React from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { Bookmark, Heart } from "lucide-react-native";
import { useUsers } from "@/hooks/useUsers";
import { Post } from "@/src/types/post";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function UsersScreen() {
  const {
    posts,
    loading,
    activeFilter,
    setActiveFilter,
    savedPostIds,
    handleToggleSave,
    filters,
    handleNavigateToPost,
    handleNavigateToSaved,
  } = useUsers();

  if (loading) {
    return <LoadingState label="Loading posts…" />;
  }

  return (
    <PageContainer style={{ paddingTop: 12 }}>
      {/* Page header */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-[24px] font-bold tracking-[0.1px]">Student Posts</Text>
        <Pressable
          className="w-[38px] h-[38px] rounded-full bg-[#1a1a1a] items-center justify-center border border-[#2a2a2a]"
          onPress={handleNavigateToSaved}
        >
          <Bookmark size={18} color="#fff" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Filter chips */}
      <View className="flex-row gap-2 mb-5">
        {filters.map((f) => {
          const active = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full border ${
                active ? "bg-white border-white" : "bg-[#1a1a1a] border-[#2a2a2a]"
              }`}
            >
              <Text className={`text-[14px] font-medium ${active ? "text-black" : "text-[#aaa]"}`}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      {posts.length === 0 ? (
        <EmptyState
          label={
            activeFilter === "yourPost"
              ? "You haven't created any posts yet."
              : "No posts available."
          }
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isSaved={savedPostIds.has(item.id)}
              onPress={() => handleNavigateToPost(item.id)}
              onToggleSave={() => handleToggleSave(item.id)}
            />
          )}
          contentContainerClassName="pb-[60px] gap-2.5"
          showsVerticalScrollIndicator={false}
        />
      )}
    </PageContainer>
  );
}

function PostCard({
  post,
  isSaved,
  onPress,
  onToggleSave,
}: {
  post: Post;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}) {
  return (
    <Pressable className="bg-[#111] rounded-[14px] p-4 border border-[#1e1e1e] flex-row items-start gap-3" onPress={onPress}>
      <View className="flex-1 gap-1.5">
        <Text className="text-white text-[15px] font-bold leading-[20px]">{post.title}</Text>
        <Text className="text-[#888] text-[13px] leading-[19px]" numberOfLines={3}>
          {post.body}
        </Text>
      </View>
      <Pressable
        className={`w-8 h-8 rounded-lg border items-center justify-center mt-0.5 shrink-0 ${
          isSaved ? "bg-white border-white" : "bg-[#1a1a1a] border-[#2a2a2a]"
        }`}
        onPress={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        hitSlop={8}
      >
        <Heart
          size={16}
          color={isSaved ? "#000" : "#666"}
          fill={isSaved ? "#000" : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}