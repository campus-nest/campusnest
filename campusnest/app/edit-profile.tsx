import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Upload } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "landlord">("student");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Could not fetch profile data.");
        return;
      }

      setFullName(data.full_name || "");
      setRole(data.role || "student");
      setUniversity(data.university || "");
      setYear(data.year || "");
      setCurrentAddress(data.current_address || "");
      setCity(data.city || "");
      setProvince(data.province || "");
      setEmail(data.email || "");
      setAvatarUrl(data.avatar_url || null);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not pick image.");
    }
  }

  async function uploadAvatar(userId: string, uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const fileExt = uri.split(".").pop() ?? "jpg";
      const filePath = `${userId}/${userId}.${fileExt}`;

      const { error } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, new Uint8Array(arrayBuffer), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Could not upload profile picture.");
      return null;
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let finalAvatarUrl = avatarUrl;

      if (imageUri) {
        const uploaded = await uploadAvatar(user.id, imageUri);
        if (uploaded) finalAvatarUrl = uploaded;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          role,
          university,
          year,
          current_address: currentAddress,
          city,
          province,
          email,
          avatar_url: finalAvatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSaving(false);
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft color="black" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: imageUri || avatarUrl || undefined }}
                style={styles.avatar}
              />
              <View style={styles.editIconContainer}>
                <Upload color="white" size={16} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: { flex: 1, backgroundColor: "black" },
  scrollContent: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    padding: 16,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#27272a",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { fontWeight: "700", fontSize: 16 },
});
