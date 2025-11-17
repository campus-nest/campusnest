import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";

type Role = "student" | "landlord";

/**
 * NewPostScreen
 * - Landlord: Create Listing
 * - Student: Create Post
 */
export default function NewPostScreen() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // landlord form state (simplified first version)
  const [listingTitle, setListingTitle] = useState("");
  const [listingAddress, setListingAddress] = useState("");
  const [listingRent, setListingRent] = useState("");
  const [listingLeaseTerm, setListingLeaseTerm] = useState("");

  // student post form state (simplified)
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  // Fetch role
  useEffect(() => {
    const loadRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const r = session?.user?.user_metadata?.role as Role | undefined;
        if (r === "student" || r === "landlord") {
          setRole(r);
        } else {
          setRole(null);
        }
      } finally {
        setRoleLoading(false);
      }
    };

    loadRole();
  }, []);

  // Handlers
  const handleCreateListing = async () => {
    if (!listingTitle || !listingAddress || !listingRent || !listingLeaseTerm) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    const rentNumber = Number(listingRent);
    if (Number.isNaN(rentNumber)) {
      Alert.alert("Invalid rent", "Rent must be a number.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      const { error } = await supabase.from("listings").insert({
        landlord_id: session.user.id,
        title: listingTitle,
        address: listingAddress,
        rent: rentNumber,
        lease_term: listingLeaseTerm,
        status: "active",
        visibility: "public",
      });

      if (error) {
        console.error("Create listing error:", error);
        Alert.alert("Error", "Could not create listing.");
        return;
      }

      // reset form
      setListingTitle("");
      setListingAddress("");
      setListingRent("");
      setListingLeaseTerm("");

      Alert.alert("Success", "Listing created.");
      router.push("/(tabs)"); // back to home feed
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle || !postBody) {
      Alert.alert("Missing info", "Please enter a title and description.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: session.user.id,
        title: postTitle,
        body: postBody,
      });

      if (error) {
        console.error("Create post error:", error);
        Alert.alert("Error", "Could not create post.");
        return;
      }

      setPostTitle("");
      setPostBody("");

      Alert.alert("Success", "Post created.");
      router.push("/(tabs)"); // back to home
    } finally {
      setSubmitting(false);
    }
  };

  // Render pieces
  const renderLandlordForm = () => (
    <>
      <Text style={styles.title}>Create Listing</Text>
      <Text style={styles.subtitle}>Share a place students can rent</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Lease Term: 8 Months (Extendable)"
          placeholderTextColor="#999"
          value={listingTitle}
          onChangeText={setListingTitle}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="2190 111-B North Avenue NW Edmonton, AB"
          placeholderTextColor="#999"
          value={listingAddress}
          onChangeText={setListingAddress}
        />
      </View>

      <View style={styles.inlineRow}>
        <View style={[styles.field, styles.inlineField]}>
          <Text style={styles.label}>Rent / month</Text>
          <TextInput
            style={styles.input}
            placeholder="780"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={listingRent}
            onChangeText={setListingRent}
          />
        </View>

        <View style={[styles.field, styles.inlineField]}>
          <Text style={styles.label}>Lease term</Text>
          <TextInput
            style={styles.input}
            placeholder="8 months"
            placeholderTextColor="#999"
            value={listingLeaseTerm}
            onChangeText={setListingLeaseTerm}
          />
        </View>
      </View>

      {/* Future: utilities, description, move-in date, map, photos */}

      <Pressable
        style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
        onPress={handleCreateListing}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Publish listing</Text>
        )}
      </Pressable>
    </>
  );

  const renderStudentForm = () => (
    <>
      <Text style={styles.title}>Create Post</Text>
      <Text style={styles.subtitle}>Tell others what you&apos;re looking for</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Looking for a roommate for Fall 2025"
          placeholderTextColor="#999"
          value={postTitle}
          onChangeText={setPostTitle}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe yourself, your preferences, and what you're looking for."
          placeholderTextColor="#999"
          value={postBody}
          onChangeText={setPostBody}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Future: university, major, budget slider, move-in date, preferred location */}

      <Pressable
        style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
        onPress={handleCreatePost}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Post</Text>
        )}
      </Pressable>
    </>
  );

  // Loading / role checks
  if (roleLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading...</Text>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>
          Could not determine your role. Please re-login.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "landlord" ? renderLandlordForm() : renderStudentForm()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
    maxWidth: 480,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  multilineInput: {
    minHeight: 120,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
  },
  inlineField: {
    flex: 1,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
});
