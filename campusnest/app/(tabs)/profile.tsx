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
import { supabase } from "@/src/lib/supabaseClient";
import { useFocusEffect, useRouter } from "expo-router";
import { Profile } from "@/src/types/profile";
import { Bell, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  async function fetchProfile() {
    try {
      // Only set loading true on first load or if profile is null to avoid flicker
      if (!profile) setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user logged in");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/landing");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
              >
                <Text style={styles.actionButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>University: {profile?.university || "NULL"}</Text>
            <Text style={styles.detailText}>Year: {profile?.year || "NULL"}</Text>
          </View>
          <Text style={styles.detailText}>Email: {profile?.email || "NULL"}</Text>
          <Text style={styles.detailText}>Current Address: {profile?.current_address || "NULL"}</Text>
          <Text style={styles.detailText}>City: {profile?.city || "NULL"}</Text>
          <Text style={styles.detailText}>Province: {profile?.province || "NULL"}</Text>
        </View>

        {/* Saved Posts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            {<View style={styles.sectionIndicator} />}
            <Text style={styles.sectionTitle}>Saved Posts</Text>
          </View>
          { /* TODO: Add saved posts from supabase */}

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
    backgroundColor: "#27272a", // zinc-800
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
    backgroundColor: "#52525b", // zinc-600
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
    color: "#a1a1aa", // zinc-400
    fontStyle: "italic",
  },
  actionButtons: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#3f3f46", // zinc-700
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
    backgroundColor: "#27272a", // zinc-800
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
    backgroundColor: "#52525b", // zinc-600
    marginRight: 8,
  },
  bookmarkIconPlaceholder: {
    width: 16,
    height: 24,
    backgroundColor: "#3f3f46", // zinc-700
    marginRight: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#18181b", // zinc-900
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  postContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  postImageContainer: {
    width: 96,
    height: 96,
    backgroundColor: "#bbf7d0", // green-200
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  postImagePlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: "#fdba74", // orange-300
    position: "relative",
  },
  roof: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 16,
    backgroundColor: "#16a34a", // green-600
  },
  door: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -12 }],
    width: 24,
    height: 32,
    backgroundColor: "#ef4444", // red-500
    borderWidth: 2,
    borderColor: "white",
  },
  postDetails: {
    flex: 1,
  },
  postTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 4,
  },
  postSubtext: {
    color: "#d4d4d8", // zinc-300
    fontSize: 12,
    marginBottom: 4,
  },
  postRent: {
    color: "white",
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 8,
  },
  viewDetailsButton: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  viewDetailsText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
  addressText: {
    color: "white",
    fontSize: 12,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  distanceLabel: {
    color: "#a1a1aa", // zinc-400
    fontSize: 12,
    fontStyle: "italic",
  },
  distanceIcons: {
    flexDirection: "row",
    gap: 16,
  },
  distanceText: {
    color: "white",
    fontSize: 12,
  },
  roommateCard: {
    backgroundColor: "#18181b", // zinc-900
    borderRadius: 16,
    padding: 16,
  },
  roommateTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  roommateDescription: {
    color: "#d4d4d8", // zinc-300
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 20,
  },
  roommateActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionIcon: {
    color: "white",
    fontSize: 20,
  },
});
