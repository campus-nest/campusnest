import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { authService, profileService } from "@/src/services";

export function useEditProfile() {
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
  const [phoneNumber, setPhoneNumber] = useState("");
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
      setPhoneNumber(profile.phone_number || "");
      setAvatarUrl(profile.avatar_url || null);
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
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

    if (role === "landlord" && !phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required for landlords");
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
        phone_number: phoneNumber,
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

  return {
    loading,
    saving,
    fullName,
    setFullName,
    role,
    university,
    setUniversity,
    year,
    setYear,
    currentAddress,
    setCurrentAddress,
    city,
    setCity,
    province,
    setProvince,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    avatarUrl,
    imageUri,
    pickImage,
    handleSave,
  };
}
