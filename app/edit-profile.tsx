import Button from "@/components/ui/Button";
import { H1 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import Stack from "@/components/ui/Stack";
import AvatarPicker from "@/components/ui/AvatarPicker";
import { useEditProfile } from "@/hooks/useEditProfile";
import LoadingState from "@/components/ui/LoadingState";
import { colors, spacing } from "@/src/constants/theme";

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
    <Screen scrollable contentContainerStyle={{ gap: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxxxl }}>
      <H1>Edit Profile</H1>

      <Stack align="center" style={{ marginBottom: spacing.lg }}>
        <AvatarPicker uri={imageUri || avatarUrl} onPress={pickImage} />
      </Stack>

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

      <Stack direction="row" gap="md">
        <Input
          label="City"
          placeholder="City"
          placeholderTextColor={colors.text.faint}
          value={city}
          onChangeText={setCity}
          containerStyle={{ flex: 1 }}
        />
        <Input
          label="Province"
          placeholder="Province"
          placeholderTextColor={colors.text.faint}
          value={province}
          onChangeText={setProvince}
          containerStyle={{ flex: 1 }}
        />
      </Stack>

      <Button fullWidth onPress={handleSave} disabled={saving}>
        {saving ? "Please wait" : "Save Changes"}
      </Button>
    </Screen>
  );
}
