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
import { Bell, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService, profileService } from "@/src/services";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    // Don't fetch if we're in the process of logging out
    if (isLoggingOut) return;

    try {
      setLoading(true);

      const profileData = await profileService.getCurrentUserProfile();

      if (!profileData) {
        console.log("No profile found");
        return;
      }

      setProfile(profileData);
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
        // Navigate first, then the screen will unmount
        router.replace("/landing");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }, [router]);

  if (loading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isLoggingOut) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Logging out...</Text>
      </View>
    );
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
                    <Text style={styles.avatarLabel}>Label</Text>
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
              University: {profile?.university || "NULL"}
            </Text>
            <Text style={styles.detailText}>
              Year: {profile?.year || "NULL"}
            </Text>
          </View>

          <Text style={styles.detailText}>
            Email: {profile?.email || "NULL"}
          </Text>
          <Text style={styles.detailText}>
            Current Address: {profile?.current_address || "NULL"}
          </Text>
          <Text style={styles.detailText}>City: {profile?.city || "NULL"}</Text>
          <Text style={styles.detailText}>
            Province: {profile?.province || "NULL"}
          </Text>
        </View>

        {/* Saved Posts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Saved Posts</Text>
          </View>

          {/* TODO: Add saved posts from database service */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 12,
    fontSize: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderRadius: 9999,
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: "#27272a",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#52525b",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
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
    borderColor: "white",
    borderStyle: "dashed",
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  avatarLabel: {
    color: "white",
    fontSize: 12,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  roleText: {
    color: "#a1a1aa",
    fontStyle: "italic",
  },
  actionButtons: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#3f3f46",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionContainer: {
    backgroundColor: "#27272a",
    borderRadius: 24,
    padding: 16,
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: "#52525b",
    marginRight: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
