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
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService, profileService } from "@/src/services";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      setLoading(true);
      const profileData = await profileService.getCurrentUserProfile();
      if (profileData) setProfile(profileData);
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
          <ChevronLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name */}
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
              {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—"}
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

        {/* Details card */}
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

        {/* Saved Posts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saved Posts</Text>
          <Text style={styles.emptyText}>No saved posts yet.</Text>
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
      <Text style={styles.detailValue}>{value || "—"}</Text>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
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
    paddingTop: 32,
    paddingBottom: 40,
    gap: 16,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "#333",
    overflow: "hidden",
    marginBottom: 4,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  heroName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  rolePill: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  rolePillText: {
    color: "#aaa",
    fontSize: 13,
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
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
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
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    gap: 2,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e1e",
  },
  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
  detailValue: {
    color: "#e0e0e0",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  emptyText: {
    color: "#555",
    fontSize: 13,
    paddingVertical: 8,
  },
});