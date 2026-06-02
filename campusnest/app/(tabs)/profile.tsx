import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Profile } from "@/src/types/profile";
import { ChevronLeft, Bookmark } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService, profileService, savedListingService, savedPostService } from "@/src/services";
import { Post } from "@/src/types/post";
import { Listing } from "@/src/types/listing";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      setLoading(true);
        const profileData = await profileService.getCurrentUserProfile();
        if (profileData) {
          setProfile(profileData);
          const session = await authService.getSession();
          if (session?.user?.id) {
            const [posts, listings] = await Promise.all([
              savedPostService.getSavedPosts(session.user.id),
              savedListingService.getSavedListings(session.user.id),
            ]);
            setSavedPosts(posts);
            setSavedListings(listings);
          }
        }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggingOut]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      const result = await authService.signOut();
      if (result.success) {
        router.replace("/landing");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }, [router]);

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (isLoggingOut) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Logging out…</Text>
      </SafeAreaView>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36, height: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarRing}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.heroName}>{profile?.full_name || "—"}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>
              {profile?.role
                ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                : "—"}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.actionBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={handleSignOut}
            disabled={isLoggingOut}
          >
            <Text style={[styles.actionBtnText, styles.actionBtnTextOutline]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account details card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <DetailRow label="Email" value={profile?.email} />
          {profile?.role === "student" && (
            <>
              <DetailRow label="University" value={profile?.university} />
              <DetailRow label="Year" value={profile?.year} />
            </>
          )}
          <DetailRow label="City" value={profile?.city} />
          <DetailRow label="Province" value={profile?.province} />
          <DetailRow label="Address" value={profile?.current_address} last />
        </View>

        {/* Saved Posts card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Saved Posts</Text>
            {savedPosts.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push("/(tabs)/saved")}
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedPosts.length === 0 ? (
            <View style={styles.savedEmpty}>
              <Bookmark size={18} color="#333" strokeWidth={1.5} />
              <Text style={styles.savedEmptyText}>No saved posts yet</Text>
            </View>
          ) : (
            <View style={styles.savedList}>
              {savedPosts.slice(0, 3).map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.savedPostRow}
                  onPress={() => router.push(`/post/${post.id}`)}
                >
                  <View style={styles.savedPostDot} />
                  <Text style={styles.savedPostTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                </TouchableOpacity>
              ))}
              {savedPosts.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}>
                  <Text style={styles.moreText}>
                    +{savedPosts.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Saved Listings</Text>
            {savedListings.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push("/(tabs)/saved")}
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedListings.length === 0 ? (
            <View style={styles.savedEmpty}>
              <Bookmark size={18} color="#333" strokeWidth={1.5} />
              <Text style={styles.savedEmptyText}>No saved listings yet</Text>
            </View>
          ) : (
            <View style={styles.savedList}>
              {savedListings.slice(0, 3).map((listing) => (
                <TouchableOpacity
                  key={listing.id}
                  style={styles.savedListingRow}
                  onPress={() => router.push(`/listing/${listing.id}`)}
                >
                  <View>
                    <Text style={styles.savedListingTitle} numberOfLines={1}>
                      {listing.title}
                    </Text>
                    <Text style={styles.savedListingMeta} numberOfLines={1}>
                      ${listing.rent.toLocaleString()} /mo — {listing.address}
                    </Text>
                  </View>
                  <View style={styles.savedPostDot} />
                </TouchableOpacity>
              ))}
              {savedListings.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}
                >
                  <Text style={styles.moreText}>
                    +{savedListings.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  last,
}: {
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 12,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 14,
  },
  heroSection: {
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: "#2a2a2a",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  heroName: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  rolePill: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  rolePillText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  actionBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  actionBtnTextOutline: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e1e1e",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    color: "#888",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },
  viewAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  viewAllText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    color: "#555",
    fontSize: 13,
    fontWeight: "500",
  },
  detailValue: {
    color: "#e0e0e0",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: "58%",
    textAlign: "right",
  },
  savedEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  savedEmptyText: {
    color: "#444",
    fontSize: 13,
  },
  savedList: {
    gap: 10,
  },
  savedListingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  savedListingTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  savedListingMeta: {
    color: "#777",
    fontSize: 11,
  },
  savedPostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  savedPostDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#333",
    flexShrink: 0,
  },
  savedPostTitle: {
    color: "#ccc",
    fontSize: 13,
    flex: 1,
  },
  moreText: {
    color: "#555",
    fontSize: 12,
    paddingTop: 2,
  },
});
