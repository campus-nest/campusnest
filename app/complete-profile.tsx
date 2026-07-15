import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { H1, H3, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import Select from "@/components/ui/Select";
import LoadingState from "@/components/ui/LoadingState";
import { useCompleteProfile } from "@/hooks/useCompleteProfile";

export default function CompleteProfileScreen() {
  const {
    role,
    setRole,
    fullName,
    setFullName,
    email,
    loading,
    initialLoading,
    currentAddress,
    setCurrentAddress,
    city,
    setCity,
    province,
    setProvince,
    university,
    setUniversity,
    year,
    setYear,
    lookingFor,
    setLookingFor,
    budget,
    setBudget,
    preferredLocation,
    setPreferredLocation,
    phoneNumber,
    setPhoneNumber,
    propertyAddress,
    setPropertyAddress,
    handleCompleteProfile,
  } = useCompleteProfile();

  if (initialLoading) {
    return <LoadingState label="Loading your account info…" />;
  }

  return (
    <Screen scrollable contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <H1 bold>Complete Profile</H1>
        <H4 italic style={styles.subtitle}>
          Just a few more details to set up your account.
        </H4>
      </View>

      {/* Basic details */}
      <View style={styles.section}>
        <Input
          label="Email Address"
          value={email}
          editable={false}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Full Name *"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Select
          label="Choose Role *"
          value={role}
          placeholder="Select role type"
          options={[
            { label: "Student", value: "student" },
            { label: "Landlord", value: "landlord" },
          ]}
          onChange={setRole}
        />
      </View>

      {/* Conditionally rendered form sections */}
      {role === "student" && (
        <View style={styles.section}>
          <H3 bold style={styles.sectionTitle}>Student Details</H3>

          <Input
            label="University *"
            placeholder="e.g. University of Alberta"
            value={university}
            onChangeText={setUniversity}
          />
          <Input
            label="Year of Study *"
            placeholder="e.g. 2nd Year"
            value={year}
            onChangeText={setYear}
          />
          <Input
            label="What are you looking for? *"
            placeholder="e.g. Roommate, 1-bedroom"
            value={lookingFor}
            onChangeText={setLookingFor}
          />
          <Input
            label="Monthly Budget *"
            placeholder="e.g. $800"
            value={budget}
            onChangeText={setBudget}
          />
          <Input
            label="Preferred Location"
            placeholder="e.g. Near campus"
            value={preferredLocation}
            onChangeText={setPreferredLocation}
          />
        </View>
      )}

      {role === "landlord" && (
        <View style={styles.section}>
          <H3 bold style={styles.sectionTitle}>Landlord Details</H3>

          <Input
            label="Phone Number *"
            placeholder="e.g. (403) 123-4567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Input
            label="Main Property Address"
            placeholder="e.g. 11234 87 Ave NW"
            value={propertyAddress}
            onChangeText={setPropertyAddress}
          />
        </View>
      )}

      {role && (
        <View style={styles.section}>
          <H3 bold style={styles.sectionTitle}>Address Details</H3>

          <Input
            label="Current Address"
            placeholder="Your current address"
            value={currentAddress}
            onChangeText={setCurrentAddress}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                label={role === "landlord" ? "City *" : "City"}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={styles.half}>
              <Input
                label={role === "landlord" ? "Province *" : "Province"}
                placeholder="Province"
                value={province}
                onChangeText={setProvince}
              />
            </View>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Button fullWidth onPress={handleCompleteProfile} disabled={loading || !role}>
          {loading ? "Completing Profile..." : "Complete Profile"}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  subtitle: {
    color: "#888",
    textAlign: "center",
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  actions: {
    marginTop: 16,
  },
});
