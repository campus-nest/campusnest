import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/hooks/useProfile";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import DetailRow from "@/components/ui/DetailRow";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile,
    savedPosts,
    savedListings,
    loading,
    isLoggingOut,
    handleSignOut,
    initials,
  } = useProfile();

  if (loading && !profile) return <LoadingState />;
  if (isLoggingOut) return <LoadingState label="Logging out…" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageHeader title="Profile" onBack={() => router.back()} />

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
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/edit-profile")}>
            <Text style={styles.actionBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={handleSignOut}
            disabled={isLoggingOut}
          >
            <Text style={[styles.actionBtnText, styles.actionBtnTextOutline]}>Log Out</Text>
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
              <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push("/(tabs)/saved")}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedPosts.length === 0 ? (
            <View style={styles.savedEmpty}>
              <Bookmark size={18} color={colors.border.strong} strokeWidth={1.5} />
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
                  <Text style={styles.savedPostTitle} numberOfLines={1}>{post.title}</Text>
                </TouchableOpacity>
              ))}
              {savedPosts.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}>
                  <Text style={styles.moreText}>+{savedPosts.length - 3} more</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Saved Listings card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Saved Listings</Text>
            {savedListings.length > 0 && (
              <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push("/(tabs)/saved")}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedListings.length === 0 ? (
            <View style={styles.savedEmpty}>
              <Bookmark size={18} color={colors.border.strong} strokeWidth={1.5} />
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
                    <Text style={styles.savedListingTitle} numberOfLines={1}>{listing.title}</Text>
                    <Text style={styles.savedListingMeta} numberOfLines={1}>
                      ${listing.rent.toLocaleString()} /mo — {listing.address}
                    </Text>
                  </View>
                  <View style={styles.savedPostDot} />
                </TouchableOpacity>
              ))}
              {savedListings.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}>
                  <Text style={styles.moreText}>+{savedListings.length - 3} more</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 14,
  },
  heroSection: {
    alignItems: "center",
    gap: 10,
    marginBottom: spacing.sm,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: colors.border.default,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: typography.weight.bold,
  },
  heroName: {
    color: colors.text.primary,
    fontSize: 21,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.1,
  },
  rolePill: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  rolePillText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  actionBtnText: {
    color: colors.black,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  actionBtnTextOutline: {
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    marginBottom: 14,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },
  viewAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  viewAllText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  savedEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  savedEmptyText: {
    color: colors.text.disabled,
    fontSize: typography.size.base,
  },
  savedList: {
    gap: 10,
  },
  savedListingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  savedListingTitle: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  savedListingMeta: {
    color: colors.text.faded,
    fontSize: typography.size.xs,
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
    backgroundColor: colors.border.strong,
    flexShrink: 0,
  },
  savedPostTitle: {
    color: colors.text.body,
    fontSize: typography.size.base,
    flex: 1,
  },
  moreText: {
    color: colors.text.dim,
    fontSize: typography.size.sm,
    paddingTop: 2,
  },
});
