import React from "react";
import Button from "@/components/ui/Button";
import { H1, H3, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { useSignUp } from "@/hooks/useSignUp";
import { StyleSheet, View } from "react-native";

export default function SignUpScreen() {
  const {
    role,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
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
    loading,
    handleSignUp,
  } = useSignUp();

  return (
    <Screen scrollable contentContainerStyle={styles.scroll}>
      <H1>Create Account</H1>
      <H4 italic>
        Join CampusNest as a {role === "student" ? "Student" : "Landlord"}
      </H4>

      <Input
        label="Full Name *"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Input
        label="Email *"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password *"
        placeholder="Create a password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        label="Confirm Password *"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {role === "landlord" && (
        <>
          <H3>Landlord Information</H3>

          <Input
            label="Phone Number *"
            placeholder="e.g., (403) 123-4567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Input
            label="Property Location"
            placeholder="Main property location"
            value={propertyAddress}
            onChangeText={setPropertyAddress}
          />
        </>
      )}

      {role === "student" && (
        <>
          <H3>Student Information</H3>

          <Input
            label="University *"
            value={university}
            onChangeText={setUniversity}
          />
          <Input
            label="Year of Study *"
            value={year}
            onChangeText={setYear}
          />
          <Input
            label="What are you looking for? *"
            value={lookingFor}
            onChangeText={setLookingFor}
          />
          <Input
            label="Monthly Budget *"
            value={budget}
            onChangeText={setBudget}
          />
          <Input
            label="Preferred Location"
            value={preferredLocation}
            onChangeText={setPreferredLocation}
          />
        </>
      )}

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
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.half}>
          <Input
            label={role === "landlord" ? "Province *" : "Province"}
            value={province}
            onChangeText={setProvince}
          />
        </View>
      </View>

      <Button fullWidth onPress={handleSignUp} disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
