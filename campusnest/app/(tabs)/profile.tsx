import LoadingState from "@/components/ui/LoadingState";
import { useProfile } from "@/src/hooks/useProfile";
import { authService } from "@/src/services";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    return <LoadingState label="" />;
  }

  if (isLoggingOut) {
    return <LoadingState label="Logging out..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft color="black" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Bell color="black" size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <View style={styles.avatarDashedBox} />
                    <Text style={styles.avatarLabel}>Photo</Text>
                  </View>
                )}
              </View>

              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>
                  {profile?.full_name || "FirstName LastName"}
                </Text>
                <Text style={styles.roleText}>
                  {profile?.role || "Student"}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/edit-profile")}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSignOut}
                disabled={isLoggingOut}
              >
                <Text style={styles.actionButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              University: {profile?.university || "—"}
            </Text>
            <Text style={styles.detailText}>Year: {profile?.year || "—"}</Text>
          </View>
          <Text style={styles.detailText}>
            Email: {profile?.email || "—"}
          </Text>
          <Text style={styles.detailText}>
            Current Address: {profile?.current_address || "—"}
          </Text>
          <Text style={styles.detailText}>
            City: {profile?.city || "—"}
          </Text>
          <Text style={styles.detailText}>
            Province: {profile?.province || "—"}
          </Text>
        </View>

        {/* Saved Posts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Saved Posts</Text>
          </View>
          {/* TODO: render saved posts from database service */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.base,
    backgroundColor: colors.backgroundWhite,
    borderRadius: 9999,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  profileCard: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.base,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.backgroundSurface,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
    overflow: "hidden",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    alignItems: "center",
  },
  avatarDashedBox: {
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderStyle: "dashed",
    width: 24,
    height: 24,
    marginBottom: spacing.xs,
  },
  avatarLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.sm,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  roleText: {
    color: "#a1a1aa",
    fontStyle: "italic",
  },
  actionButtons: {
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.backgroundSurface,
    paddingHorizontal: spacing.base,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.textPrimary,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  detailText: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.bold,
  },
  sectionContainer: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 24,
    padding: spacing.base,
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: colors.backgroundSurface,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
});
