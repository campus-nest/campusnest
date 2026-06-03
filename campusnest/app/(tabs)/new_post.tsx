import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Hook
import { useNewPost } from "@/hooks/useNewPost";

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
  const {
    role,
    roleLoading,
    submitting,
    listingTitle,
    setListingTitle,
    listingAddress,
    setListingAddress,
    listingRent,
    setListingRent,
    listingLeaseTerm,
    setListingLeaseTerm,
    selectedUtilities,
    handleUtilityToggle,
    nearbyUniversity,
    setNearbyUniversity,
    description,
    setDescription,
    tenantPreferences,
    setTenantPreferences,
    leaseTermOption,
    setLeaseTermOption,
    furnishedStatus,
    setFurnishedStatus,
    moveInDate,
    setMoveInDate,
    locationArea,
    setLocationArea,
    photoUris,
    setPhotoUris,
    activeTab,
    setActiveTab,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    securityDeposit,
    setSecurityDeposit,
    selectedLocation,
    handleLocationSelected,
    postTitle,
    setPostTitle,
    postBody,
    setPostBody,
    showDatePicker,
    setShowDatePicker,
    pickImages,
    handleCreateListing,
    handleCreatePost,
  } = useNewPost();

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
        labelStyle={styles.labelDark}
        placeholder="Looking for a roommate for Fall 2025"
        value={postTitle}
        onChangeText={setPostTitle}
        containerStyle={styles.field}
      />

      <Input
        label="Description"
        labelStyle={styles.labelDark}
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
    <Screen scrollable contentContainerStyle={styles.scrollContent}>
      {role === "landlord" ? renderLandlordForm() : renderStudentForm()}
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
  tabSelector: {
    marginBottom: 12,
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
