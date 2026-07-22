import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/hooks/useProfile";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import DetailRow from "@/components/ui/DetailRow";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import CardSectionHeader from "@/components/ui/CardSectionHeader";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.screen }}>
      <PageHeader title="Profile" onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl + 4,
          paddingBottom: spacing.xxxxl,
          gap: spacing.md + 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name hero */}
        <View style={{ alignItems: "center", gap: spacing.md - 2, marginBottom: spacing.sm }}>
          <Avatar uri={profile?.avatar_url} initials={initials} size={84} initialsSize={26} bordered />
          <Text
            style={{
              color: colors.text.primary,
              fontSize: typography.size.xxl + 1,
              fontWeight: typography.weight.bold,
              letterSpacing: 0.1,
            }}
          >
            {profile?.full_name || "—"}
          </Text>
          <View
            style={{
              backgroundColor: colors.background.elevated,
              borderWidth: 1,
              borderColor: colors.border.default,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            }}
          >
            <Text style={{ color: colors.text.secondary, fontSize: typography.size.sm, fontWeight: typography.weight.medium }}>
              {profile?.role
                ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                : "—"}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: spacing.md - 2 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.white,
              borderRadius: radius.md,
              paddingVertical: spacing.md + 1,
              alignItems: "center",
            }}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={{ color: colors.black, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.border.default,
              borderRadius: radius.md,
              paddingVertical: spacing.md + 1,
              alignItems: "center",
            }}
            onPress={handleSignOut}
            disabled={isLoggingOut}
          >
            <Text style={{ color: colors.text.primary, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account details card */}
        <Card variant="dark">
          <CardSectionHeader title="Account Details" />
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
        </Card>

        {/* Saved Posts card */}
        <Card variant="dark">
          <CardSectionHeader
            title="Saved Posts"
            actionLabel={savedPosts.length > 0 ? "View all" : undefined}
            onAction={() => router.push("/(tabs)/saved")}
          />

          {savedPosts.length === 0 ? (
            <SavedEmptyRow text="No saved posts yet" />
          ) : (
            <View style={{ gap: spacing.md - 2 }}>
              {savedPosts.slice(0, 3).map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={{ flexDirection: "row", alignItems: "center", gap: spacing.md - 2 }}
                  onPress={() => router.push(`/post/${post.id}`)}
                >
                  <Dot />
                  <Text style={{ color: colors.text.body, fontSize: typography.size.base, flex: 1 }} numberOfLines={1}>
                    {post.title}
                  </Text>
                </TouchableOpacity>
              ))}
              {savedPosts.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}>
                  <Text style={{ color: colors.text.dim, fontSize: typography.size.sm, paddingTop: spacing.xs / 2 }}>
                    +{savedPosts.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card>

        {/* Saved Listings card */}
        <Card variant="dark">
          <CardSectionHeader
            title="Saved Listings"
            actionLabel={savedListings.length > 0 ? "View all" : undefined}
            onAction={() => router.push("/(tabs)/saved")}
          />

          {savedListings.length === 0 ? (
            <SavedEmptyRow text="No saved listings yet" />
          ) : (
            <View style={{ gap: spacing.md - 2 }}>
              {savedListings.slice(0, 3).map((listing) => (
                <TouchableOpacity
                  key={listing.id}
                  style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md }}
                  onPress={() => router.push(`/listing/${listing.id}`)}
                >
                  <View>
                    <Text
                      style={{ color: colors.text.primary, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}
                      numberOfLines={1}
                    >
                      {listing.title}
                    </Text>
                    <Text style={{ color: colors.text.faded, fontSize: typography.size.xs }} numberOfLines={1}>
                      ${listing.rent.toLocaleString()} /mo — {listing.address}
                    </Text>
                  </View>
                  <Dot />
                </TouchableOpacity>
              ))}
              {savedListings.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/saved")}>
                  <Text style={{ color: colors.text.dim, fontSize: typography.size.sm, paddingTop: spacing.xs / 2 }}>
                    +{savedListings.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedEmptyRow({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs }}>
      <Bookmark size={18} color={colors.border.strong} strokeWidth={1.5} />
      <Text style={{ color: colors.text.disabled, fontSize: typography.size.base }}>{text}</Text>
    </View>
  );
}

function Dot() {
  return (
    <View
      style={{
        width: spacing.xs + 1,
        height: spacing.xs + 1,
        borderRadius: radius.sm,
        backgroundColor: colors.border.strong,
        flexShrink: 0,
      }}
    />
  );
}
