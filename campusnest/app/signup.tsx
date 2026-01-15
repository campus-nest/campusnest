import Button from "@/components/ui/Button";
import { H1, H3, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import { getSupabase } from "@/src/lib/supabaseClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View, ScrollView } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: "student" | "landlord" }>();

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentAddress, setCurrentAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  // Student
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");

  // Landlord
  const [phoneNumber, setPhoneNumber] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!role) {
      Alert.alert(
        "Error",
        "Missing role. Please go back and select a role."
      );
      return false;
    }
  
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
  
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
  
    if (role === "student") {
      if (!university || !year || !lookingFor || !budget) {
        Alert.alert("Error", "Please fill in all student-specific fields");
        return false;
      }
    }
  
    if (role === "landlord") {
      if (!phoneNumber || !city || !province) {
        Alert.alert("Error", "Please fill in all landlord-specific fields");
        return false;
      }
    }
  
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const supabase = getSupabase();

      const userData: any = {
        full_name: fullName,
        role,
        email: email.trim(),
        city,
        province,
        current_address: currentAddress,
      };

      if (role === "student") {
        Object.assign(userData, {
          university,
          year,
          looking_for: lookingFor,
          budget,
          preferred_location: preferredLocation,
        });
      }

      if (role === "landlord") {
        Object.assign(userData, {
          phone_number: phoneNumber,
          property_address: propertyAddress,
        });
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: "https://campusnest.uofacs.ca/",
          data: userData,
        },
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
        return;
      }

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/verify-email") }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
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

            <Input label="University *" value={university} onChangeText={setUniversity} />
            <Input label="Year of Study *" value={year} onChangeText={setYear} />
            <Input label="What are you looking for? *" value={lookingFor} onChangeText={setLookingFor} />
            <Input label="Monthly Budget *" value={budget} onChangeText={setBudget} />
            <Input label="Preferred Location" value={preferredLocation} onChangeText={setPreferredLocation} />
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
            <Input label="City" value={city} onChangeText={setCity} />
          </View>
          <View style={styles.half}>
            <Input label="Province" value={province} onChangeText={setProvince} />
          </View>
        </View>

        <Button fullWidth onPress={handleSignUp} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
    gap: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
