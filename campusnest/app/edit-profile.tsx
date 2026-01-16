import Button from "@/components/ui/Button";
import { H1 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { authService, profileService } from "@/src/services";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Upload } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

      const user = await authService.getCurrentUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const profile = await profileService.getProfileById(user.id);

      if (!profile) {
        Alert.alert("Error", "Could not fetch profile data.");
        return;
      }

      setFullName(profile.full_name || "");
      setRole(profile.role || "student");
      setUniversity(profile.university || "");
      setYear(profile.year || "");
      setCurrentAddress(profile.current_address || "");
      setCity(profile.city || "");
      setProvince(profile.province || "");
      setEmail(profile.email || "");
      setAvatarUrl(profile.avatar_url || null);
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

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    try {
      setSaving(true);

      const user = await authService.getCurrentUser();

      if (!user) return;

      let finalAvatarUrl = avatarUrl;

      if (imageUri) {
        const uploaded = await profileService.uploadAvatar(user.id, imageUri);
        if (uploaded) finalAvatarUrl = uploaded;
      }

      const result = await profileService.updateProfile(user.id, {
        full_name: fullName,
        role,
        university,
        year,
        current_address: currentAddress,
        city,
        province,
        email,
        avatar_url: finalAvatarUrl || undefined,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not update profile.");
        return;
      }

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
    <Screen>
      {/* Header */}
      <H1>Edit Profile</H1>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage}>
          {imageUri || avatarUrl ? (
            <Image
              source={{ uri: imageUri || avatarUrl || undefined }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarPlaceholder}>Add Photo</Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Upload color="white" size={16} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <Input
        label="Full Name *"
        placeholder="Enter your full name"
        placeholderTextColor="#666"
        value={fullName}
        onChangeText={setFullName}
      />

      <Input
        label="Email *"
        placeholder="Enter your email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {role === "student" && (
        <Input
          label="University"
          placeholder="e.g., University of Calgary"
          placeholderTextColor="#666"
          value={university}
          onChangeText={setUniversity}
        />
      )}
      {role === "student" && (
        <Input
          label="Year of Study"
          placeholder="e.g., 2nd Year"
          placeholderTextColor="#666"
          value={year}
          onChangeText={setYear}
        />
      )}
      <Input
        label="Current Address"
        placeholder="Enter your address"
        placeholderTextColor="#666"
        value={currentAddress}
        onChangeText={setCurrentAddress}
      />

      <View style={styles.rowContainer}>
        <View style={[styles.halfWidth]}>
          <Input
            label="City"
            placeholder="City"
            placeholderTextColor="#666"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={[styles.halfWidth]}>
          <Input
            label="Province"
            placeholder="Province"
            placeholderTextColor="#666"
            value={province}
            onChangeText={setProvince}
          />
        </View>
      </View>

      {/* Save Button */}
      <Button fullWidth onPress={handleSave} disabled={saving}>
        {saving ? "Please wait" : "Save Changes"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#27272a",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    color: "#666",
    fontSize: 14,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 20,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});
