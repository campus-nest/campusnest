import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Services
import { authService, listingService, postService } from "@/src/services";

// UI Components
import { ImagePickerPreview } from "@/components/listings/ImagePickerPreview";
import AddressInput, { LocationData } from "@/components/ui/AddressInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ChipGroup, ToggleChipGroup } from "@/components/ui/Chip";
import { CycleDropdown } from "@/components/ui/Dropdown";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import Section, { Divider } from "@/components/ui/Section";
import TabSelector from "@/components/ui/TabSelector";

type Role = "student" | "landlord";

// Constants
const UTILITY_OPTIONS = ["electricity", "water", "wifi", "heat"];
const LEASE_TERM_OPTIONS = [
  { label: "4 months", value: "4 months" },
  { label: "8 months", value: "8 months" },
  { label: "12 months", value: "12 months" },
];
const FURNISHED_OPTIONS = [
  { label: "Furnished", value: "furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

export default function NewPostScreen() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Landlord form state
  const [listingTitle, setListingTitle] = useState("");
  const [listingAddress, setListingAddress] = useState("");
  const [listingRent, setListingRent] = useState("");
  const [listingLeaseTerm, setListingLeaseTerm] = useState("");
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [nearbyUniversity, setNearbyUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [tenantPreferences, setTenantPreferences] = useState("");
  const [leaseTermOption, setLeaseTermOption] = useState<string | null>(null);
  const [furnishedStatus, setFurnishedStatus] = useState<string | null>(null);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [locationArea, setLocationArea] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("rent");

  // Location state (from map picker)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );

  // Student post form state
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch role on mount
  useEffect(() => {
    const loadRole = async () => {
      try {
        const userRole = await authService.getUserRole();
        setRole(userRole);
      } finally {
        setRoleLoading(false);
      }
    };
    loadRole();
  }, []);

  // Utility toggle handler
  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities((prev) =>
      prev.includes(utility)
        ? prev.filter((u) => u !== utility)
        : [...prev, utility],
    );
  };

  // Image picker
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newUris = result.assets.map((a) => a.uri);
        setPhotoUris((prev) => Array.from(new Set([...prev, ...newUris])));
      }
    } catch (e) {
      console.error("Image pick error:", e);
      Alert.alert("Error", "Could not pick images.");
    }
  };

  // Reset landlord form
  const resetLandlordForm = () => {
    setListingTitle("");
    setListingAddress("");
    setListingRent("");
    setListingLeaseTerm("");
    setSelectedUtilities([]);
    setNearbyUniversity("");
    setDescription("");
    setTenantPreferences("");
    setLeaseTermOption(null);
    setFurnishedStatus(null);
    setMoveInDate(null);
    setLocationArea("");
    setPhotoUris([]);
    setActiveTab("rent");
    setSelectedLocation(null);
  };

  // Create listing handler
  const handleCreateListing = async () => {
    // Validate required fields
    if (!listingTitle) {
      Alert.alert("Missing info", "Please enter a listing title.");
      return;
    }

    if (!listingAddress && !selectedLocation) {
      Alert.alert(
        "Missing info",
        "Please enter an address or select a location on the map.",
      );
      return;
    }

    if (!listingRent) {
      Alert.alert("Missing info", "Please enter the rent amount.");
      return;
    }

    if (!leaseTermOption && !listingLeaseTerm) {
      Alert.alert("Missing info", "Please select or enter a lease term.");
      return;
    }

    // Validate location is selected on map
    if (!selectedLocation) {
      Alert.alert(
        "Location Required",
        "Please select your listing location on the map so students can find it easily.",
        [{ text: "OK" }],
      );
      return;
    }

    const rentNumber = Number(listingRent);
    if (Number.isNaN(rentNumber)) {
      Alert.alert("Invalid rent", "Rent must be a number.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      // Upload photos
      const uploadedUrls = await listingService.uploadListingPhotos(
        user.id,
        photoUris,
      );

      const result = await listingService.createListing({
        landlord_id: user.id,
        title: listingTitle,
        address:
          listingAddress ||
          selectedLocation.address ||
          "Location selected on map",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        rent: rentNumber,
        lease_term: leaseTermOption || listingLeaseTerm,
        status: "active",
        visibility: "public",
        utilities:
          selectedUtilities.length > 0 ? selectedUtilities.join(", ") : null,
        nearby_university: nearbyUniversity || null,
        description: description || null,
        tenant_preferences: tenantPreferences || null,
        is_furnished:
          furnishedStatus === "furnished"
            ? true
            : furnishedStatus === "unfurnished"
              ? false
              : null,
        move_in_date: moveInDate ? moveInDate.toISOString() : null,
        location_area: locationArea || null,
        photo_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not create listing.");
        return;
      }

      resetLandlordForm();
      Alert.alert(
        "Success",
        "Listing created! It will now appear on the map for students.",
      );
      router.push("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  // Create post handler (student)
  const handleCreatePost = async () => {
    if (!postTitle || !postBody) {
      Alert.alert("Missing info", "Please enter a title and description.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      const result = await postService.createPost({
        user_id: user.id,
        title: postTitle,
        body: postBody,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not create post.");
        return;
      }

      setPostTitle("");
      setPostBody("");
      Alert.alert("Success", "Post created.");
      router.push("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelected = (location: LocationData | null) => {
    setSelectedLocation(location);
  };

  // Landlord Form
  const renderLandlordForm = () => (
    <>
      <H1 style={styles.title}>Create Listing</H1>
      <H4 style={styles.subtitle}>Share a place students can rent</H4>

      <Card variant="light" style={styles.formCard}>
        <TabSelector
          tabs={[
            { label: "Rent", value: "rent" },
            { label: "Price", value: "price" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="light"
          style={styles.tabSelector}
        />

        <Divider variant="light" />

        {/* Basic Info */}
        <Input
          label="Listing Title"
          placeholder="Cozy 2-bedroom near campus"
          value={listingTitle}
          onChangeText={setListingTitle}
          style={styles.inputLight}
          containerStyle={styles.field}
        />

        {/* Address with Map Picker */}
        <AddressInput
          label="Address"
          placeholder="123 University Ave, Edmonton, AB"
          value={listingAddress}
          onChangeText={setListingAddress}
          selectedLocation={selectedLocation}
          onLocationSelected={handleLocationSelected}
          variant="light"
          containerStyle={styles.field}
        />

        {/* Utilities */}
        <Section title="Utilities" variant="light">
          <ChipGroup
            options={UTILITY_OPTIONS}
            selected={selectedUtilities}
            onToggle={handleUtilityToggle}
            variant="light"
          />
        </Section>

        {/* Nearby University */}
        <View style={styles.field}>
          <Input
            label="Nearby University"
            placeholder="Select college"
            value={nearbyUniversity}
            onChangeText={setNearbyUniversity}
            style={styles.inputLight}
          />
          {nearbyUniversity.length === 0 && (
            <Pressable
              style={styles.suggestionBox}
              onPress={() => setNearbyUniversity("University of Alberta")}
            >
              <Text style={styles.suggestionText}>University of Alberta</Text>
            </Pressable>
          )}
        </View>

        {/* Description */}
        <Input
          label="Description"
          placeholder="Tell people about your place"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.inputLight, styles.multilineInput]}
          containerStyle={styles.field}
        />

        {/* Tenant Preferences */}
        <Input
          label="Tenant Preferences"
          placeholder="What do you look for?"
          value={tenantPreferences}
          onChangeText={setTenantPreferences}
          multiline
          style={[styles.inputLight, styles.multilineInput]}
          containerStyle={styles.field}
        />

        {/* Lease Term Dropdown */}
        <CycleDropdown
          label="Lease Term"
          value={leaseTermOption}
          placeholder="Select lease term"
          options={LEASE_TERM_OPTIONS}
          onChange={(val) => {
            setLeaseTermOption(val);
            setListingLeaseTerm(val);
          }}
          variant="light"
          containerStyle={styles.field}
        />

        {/* Furnished Toggle */}
        <Section title="Furnishing" variant="light">
          <ToggleChipGroup
            options={FURNISHED_OPTIONS}
            value={furnishedStatus}
            onChange={setFurnishedStatus}
            variant="light"
          />
        </Section>

        {/* Move In Date */}
        <View style={styles.field}>
          <Text style={styles.labelLight}>Move In Date</Text>
          <Pressable
            style={styles.dateDropdown}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateDropdownText}>
              {moveInDate
                ? moveInDate.toLocaleDateString()
                : "Select move in date"}
            </Text>
            <Text style={styles.dateIcon}>📅</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={moveInDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setMoveInDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Rent and Lease Term Row */}
        <View style={styles.row}>
          <Input
            label="Rent / month"
            placeholder="780"
            value={listingRent}
            onChangeText={setListingRent}
            keyboardType="numeric"
            style={styles.inputLight}
            containerStyle={styles.halfField}
          />
          <Input
            label="Lease term text"
            placeholder="8 months"
            value={listingLeaseTerm}
            onChangeText={setListingLeaseTerm}
            style={styles.inputLight}
            containerStyle={styles.halfField}
          />
        </View>

        {/* Location Area */}
        <Input
          label="Neighborhood / Area"
          placeholder="e.g. Downtown, Whyte Ave"
          value={locationArea}
          onChangeText={setLocationArea}
          style={styles.inputLight}
          containerStyle={styles.field}
        />

        {/* Photo Preview */}
        {photoUris.length > 0 && (
          <ImagePickerPreview
            photos={photoUris}
            onRemove={(uri) =>
              setPhotoUris((prev) => prev.filter((p) => p !== uri))
            }
          />
        )}

        {/* Upload Button */}
        <Pressable style={styles.uploadButton} onPress={pickImages}>
          <Text style={styles.uploadButtonText}>
            {photoUris.length ? "Add more photos" : "Upload photos"}
          </Text>
        </Pressable>
      </Card>

      {/* Submit Button */}
      <Button fullWidth onPress={handleCreateListing} disabled={submitting}>
        {submitting ? "Publishing..." : "Publish listing"}
      </Button>
    </>
  );

  // Student Form
  const renderStudentForm = () => (
    <>
      <H1 style={styles.title}>Create Post</H1>
      <H4 style={styles.subtitle}>Tell others what you&apos;re looking for</H4>

      <Input
        label="Title"
        placeholder="Looking for a roommate for Fall 2025"
        value={postTitle}
        onChangeText={setPostTitle}
        containerStyle={styles.field}
      />

      <Input
        label="Description"
        placeholder="Describe yourself, your preferences, and what you're looking for."
        value={postBody}
        onChangeText={setPostBody}
        multiline
        style={styles.multilineInput}
        containerStyle={styles.field}
      />

      <Button fullWidth onPress={handleCreatePost} disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </Button>
    </>
  );

  // Loading state
  if (roleLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading...</Text>
      </View>
    );
  }

  // No role state
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
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "landlord" ? renderLandlordForm() : renderStudentForm()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: "left",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "left",
    color: "#aaa",
    marginBottom: 20,
  },
  formCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  tabSelector: {
    marginBottom: 12,
  },
  field: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  halfField: {
    flex: 1,
  },
  inputLight: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    color: "#000",
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  labelLight: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  suggestionBox: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 13,
    color: "#333",
  },
  dateDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  dateDropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dateIcon: {
    fontSize: 14,
  },
  uploadButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
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
