import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

// Services
import { authService, listingService } from "@/src/services";
import { ListingStatus, ListingVisibility } from "@/src/types/listing";

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
const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Rented", value: "rented" },
];
const VISIBILITY_OPTIONS = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listingId = id ?? "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
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
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [status, setStatus] = useState<ListingStatus>("active");
  const [visibility, setVisibility] = useState<ListingVisibility>("public");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );

  // Load existing listing on mount
  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const listing = await listingService.getListingById(listingId);
        if (!listing) {
          Alert.alert("Error", "Listing not found.");
          router.back();
          return;
        }

        setListingTitle(listing.title ?? "");
        setListingAddress(listing.address ?? "");
        setListingRent(listing.rent != null ? String(listing.rent) : "");
        setListingLeaseTerm(listing.lease_term ?? "");

        const utils = listing.utilities
          ? listing.utilities.split(", ").map((u) => u.trim())
          : [];
        setSelectedUtilities(utils);

        setNearbyUniversity(listing.nearby_university ?? "");
        setDescription(listing.description ?? "");
        setTenantPreferences(listing.tenant_preferences ?? "");

        const match = LEASE_TERM_OPTIONS.find(
          (opt) => opt.value === listing.lease_term,
        );
        setLeaseTermOption(match ? match.value : null);

        setFurnishedStatus(
          listing.is_furnished === true
            ? "furnished"
            : listing.is_furnished === false
              ? "unfurnished"
              : null,
        );

        setMoveInDate(listing.move_in_date ? new Date(listing.move_in_date) : null);
        setLocationArea(listing.location_area ?? "");
        setExistingPhotoUrls(listing.photo_urls ?? []);

        setBedrooms(listing.bedrooms != null ? String(listing.bedrooms) : "");
        setBathrooms(listing.bathrooms != null ? String(listing.bathrooms) : "");
        setSecurityDeposit(
          listing.security_deposit != null ? String(listing.security_deposit) : "",
        );

        setStatus(listing.status ?? "active");
        setVisibility(listing.visibility ?? "public");

        if (listing.latitude != null && listing.longitude != null) {
          setSelectedLocation({
            latitude: listing.latitude,
            longitude: listing.longitude,
            address: listing.address,
          });
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not load listing.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

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

  // Save changes handler
  const handleSave = async () => {
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

    if (!selectedLocation) {
      Alert.alert(
        "Location Required",
        "Please select your listing location on the map.",
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

      // Upload newly added photos
      let uploadedUrls: string[] = [];
      if (photoUris.length > 0) {
        uploadedUrls = await listingService.uploadListingPhotos(
          user.id,
          photoUris,
        );
      }

      // Combine remaining existing photos with new ones
      const finalPhotoUrls = [...existingPhotoUrls, ...uploadedUrls];

      const result = await listingService.updateListing(listingId, {
        title: listingTitle,
        address:
          listingAddress ||
          selectedLocation.address ||
          "Location selected on map",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        rent: rentNumber,
        lease_term: leaseTermOption || listingLeaseTerm,
        status: status,
        visibility: visibility,
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
        photo_urls: finalPhotoUrls.length > 0 ? finalPhotoUrls : null,
        bedrooms: bedrooms !== "" ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms !== "" ? parseInt(bathrooms, 10) : null,
        security_deposit:
          securityDeposit !== "" ? parseFloat(securityDeposit) : null,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not save listing.");
        return;
      }

      Alert.alert("Success", "Listing updated successfully!");
      router.replace(`/listing/${listingId}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSelected = (location: LocationData | null) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading listing details...</Text>
      </View>
    );
  }

  return (
    <Screen scrollable contentContainerStyle={styles.scrollContent}>
      <H1 style={styles.title}>Edit Listing</H1>
      <H4 style={styles.subtitle}>Update the details of your property</H4>

      <Card variant="light" style={styles.formCard}>
        {/* Title */}
        <Input
          label="Listing Title"
          labelStyle={styles.labelDark}
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
            labelStyle={styles.labelDark}
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
          labelStyle={styles.labelDark}
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
          labelStyle={styles.labelDark}
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
              {moveInDate ? moveInDate.toLocaleDateString() : "Select move in date"}
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

        {/* Bedrooms and Bathrooms Row */}
        <View style={styles.row}>
          <Input
            label="Bedrooms"
            labelStyle={styles.labelDark}
            placeholder="e.g. 2"
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
            style={styles.inputLight}
            containerStyle={styles.halfField}
          />
          <Input
            label="Bathrooms"
            labelStyle={styles.labelDark}
            placeholder="e.g. 1"
            value={bathrooms}
            onChangeText={setBathrooms}
            keyboardType="numeric"
            style={styles.inputLight}
            containerStyle={styles.halfField}
          />
        </View>

        {/* Security Deposit */}
        <Input
          label="Security Deposit ($)"
          labelStyle={styles.labelDark}
          placeholder="e.g. 1200"
          value={securityDeposit}
          onChangeText={setSecurityDeposit}
          keyboardType="numeric"
          style={styles.inputLight}
          containerStyle={styles.field}
        />

        {/* Rent and Lease Term Row */}
        <View style={styles.row}>
          <Input
            label="Rent / month"
            labelStyle={styles.labelDark}
            placeholder="780"
            value={listingRent}
            onChangeText={setListingRent}
            keyboardType="numeric"
            style={styles.inputLight}
            containerStyle={styles.halfField}
          />
          <Input
            label="Lease term text"
            labelStyle={styles.labelDark}
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
          labelStyle={styles.labelDark}
          placeholder="e.g. Downtown, Whyte Ave"
          value={locationArea}
          onChangeText={setLocationArea}
          style={styles.inputLight}
          containerStyle={styles.field}
        />

        {/* Status Dropdown */}
        <CycleDropdown
          label="Listing Status"
          value={status}
          placeholder="Select status"
          options={STATUS_OPTIONS}
          onChange={(val) => setStatus(val as ListingStatus)}
          variant="light"
          containerStyle={styles.field}
        />

        {/* Visibility Dropdown */}
        <CycleDropdown
          label="Visibility"
          value={visibility}
          placeholder="Select visibility"
          options={VISIBILITY_OPTIONS}
          onChange={(val) => setVisibility(val as ListingVisibility)}
          variant="light"
          containerStyle={styles.field}
        />

        {/* Existing Photos Preview */}
        {existingPhotoUrls.length > 0 && (
          <View style={styles.field}>
            <Text style={styles.labelDark}>Existing Photos</Text>
            <ImagePickerPreview
              photos={existingPhotoUrls}
              onRemove={(url) =>
                setExistingPhotoUrls((prev) => prev.filter((p) => p !== url))
              }
            />
          </View>
        )}

        {/* Newly Selected Photos Preview */}
        {photoUris.length > 0 && (
          <View style={styles.field}>
            <Text style={styles.labelDark}>New Photos to Upload</Text>
            <ImagePickerPreview
              photos={photoUris}
              onRemove={(uri) =>
                setPhotoUris((prev) => prev.filter((p) => p !== uri))
              }
            />
          </View>
        )}

        {/* Upload Button */}
        <Pressable style={styles.uploadButton} onPress={pickImages}>
          <Text style={styles.uploadButtonText}>
            {photoUris.length || existingPhotoUrls.length
              ? "Add more photos"
              : "Upload photos"}
          </Text>
        </Pressable>
      </Card>

      {/* Submit Button */}
      <Button fullWidth onPress={handleSave} disabled={submitting}>
        {submitting ? "Saving changes..." : "Save Changes"}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    textAlign: "left",
    marginBottom: 4,
    color: "#fff",
  },
  subtitle: {
    textAlign: "left",
    color: "#aaa",
    marginBottom: 20,
  },
  formCard: {
    marginTop: 2,
    marginBottom: 16,
    width: "100%",
    alignSelf: "stretch",
    maxWidth: 1000,
  },
  field: {
    width: "100%",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    width: "100%",
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
  labelDark: {
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  suggestionBox: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
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
    width: "100%",
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
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    width: "100%",
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
    marginTop: 12,
    textAlign: "center",
  },
});
