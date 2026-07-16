import React from "react";
import Button from "@/components/ui/Button";
import { H1 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { Upload } from "lucide-react-native";
import { useEditProfile } from "@/hooks/useEditProfile";
import LoadingState from "@/components/ui/LoadingState";
import { colors, radius, spacing } from "@/src/constants/theme";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const {
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
  } = useEditProfile();

  if (loading) return <LoadingState />;

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <H1>Edit Profile</H1>

      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage}>
          {imageUri || avatarUrl ? (
            <Image source={{ uri: imageUri || avatarUrl || undefined }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarPlaceholder}>Add Photo</Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Upload color={colors.white} size={16} />
          </View>
        </TouchableOpacity>
      </View>

      <Input
        label="Full Name *"
        placeholder="Enter your full name"
        placeholderTextColor={colors.text.faint}
        value={fullName}
        onChangeText={setFullName}
      />

      <Input
        label="Email *"
        placeholder="Enter your email"
        placeholderTextColor={colors.text.faint}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {role === "landlord" && (
        <Input
          label="Phone Number *"
          placeholder="e.g., (403) 123-4567"
          placeholderTextColor={colors.text.faint}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      )}

      {role === "student" && (
        <Input
          label="University"
          placeholder="e.g., University of Calgary"
          placeholderTextColor={colors.text.faint}
          value={university}
          onChangeText={setUniversity}
        />
      )}
      {role === "student" && (
        <Input
          label="Year of Study"
          placeholder="e.g., 2nd Year"
          placeholderTextColor={colors.text.faint}
          value={year}
          onChangeText={setYear}
        />
      )}

      <Input
        label="Current Address"
        placeholder="Enter your address"
        placeholderTextColor={colors.text.faint}
        value={currentAddress}
        onChangeText={setCurrentAddress}
      />

      <View style={styles.rowContainer}>
        <View style={styles.halfWidth}>
          <Input label="City" placeholder="City" placeholderTextColor={colors.text.faint} value={city} onChangeText={setCity} />
        </View>
        <View style={styles.halfWidth}>
          <Input label="Province" placeholder="Province" placeholderTextColor={colors.text.faint} value={province} onChangeText={setProvince} />
        </View>
      </View>

      <Button fullWidth onPress={handleSave} disabled={saving}>
        {saving ? "Please wait" : "Save Changes"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    color: colors.text.faint,
    fontSize: 14,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    padding: spacing.sm,
    borderRadius: radius.xl,
  },
  rowContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
});
