import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

// Hook
import { useNewPost } from "@/hooks/useNewPost";

// UI Components
import { ImagePickerPreview } from "@/components/listings/ImagePickerPreview";
import AddressInput from "@/components/ui/AddressInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ChipGroup, ToggleChipGroup } from "@/components/ui/Chip";
import { CycleDropdown } from "@/components/ui/Dropdown";
import { H1, H4 } from "@/components/ui/Headings";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import Section, { Divider } from "@/components/ui/Section";
import TabSelector from "@/components/ui/TabSelector";
import LoadingState from "@/components/ui/LoadingState";

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
      <H1 className="text-left mb-1" style={{ textAlign: "left", marginBottom: 4 }}>Create Listing</H1>
      <H4 className="text-left text-[#aaa] mb-5" style={{ textAlign: "left", color: "#aaa", marginBottom: 20 }}>Share a place students can rent</H4>

      <Card variant="light" className="mt-0.5 mb-4 w-full self-stretch max-w-[1000px]">
        <View className="mb-3">
          <TabSelector
            tabs={[
              { label: "Rent", value: "rent" },
              { label: "Price", value: "price" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="light"
          />
        </View>

        <Divider variant="light" />

        {/* Basic Info */}
        <Input
          label="Listing Title"
          labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
          placeholder="Cozy 2-bedroom near campus"
          value={listingTitle}
          onChangeText={setListingTitle}
          className="bg-white border-[#ddd] text-black"
          containerClassName="w-full mb-4"
        />

        {/* Address with Map Picker */}
        <View className="w-full mb-4">
          <AddressInput
            label="Address"
            placeholder="123 University Ave, Edmonton, AB"
            value={listingAddress}
            onChangeText={setListingAddress}
            selectedLocation={selectedLocation}
            onLocationSelected={handleLocationSelected}
            variant="light"
          />
        </View>

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
        <View className="w-full mb-4">
          <Input
            label="Nearby University"
            labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
            placeholder="Select college"
            value={nearbyUniversity}
            onChangeText={setNearbyUniversity}
            className="bg-white border-[#ddd] text-black"
          />
          {nearbyUniversity.length === 0 && (
            <Pressable
              className="mt-1.5 rounded-xl bg-white p-2 shadow-sm"
              onPress={() => setNearbyUniversity("University of Alberta")}
            >
              <Text className="text-[14px] text-[#333]">University of Alberta</Text>
            </Pressable>
          )}
        </View>

        {/* Description */}
        <Input
          label="Description"
          labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
          placeholder="Tell people about your place"
          value={description}
          onChangeText={setDescription}
          multiline
          className="bg-white border-[#ddd] text-black min-h-[120px]"
          style={{ textAlignVertical: "top" }}
          containerClassName="w-full mb-4"
        />

        {/* Tenant Preferences */}
        <Input
          label="Tenant Preferences"
          labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
          placeholder="What do you look for?"
          value={tenantPreferences}
          onChangeText={setTenantPreferences}
          multiline
          className="bg-white border-[#ddd] text-black min-h-[120px]"
          style={{ textAlignVertical: "top" }}
          containerClassName="w-full mb-4"
        />

        {/* Lease Term Dropdown */}
        <View className="w-full mb-4">
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
          />
        </View>

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
        <View className="w-full mb-4">
          <Text className="text-[#333] text-[14px] font-medium mb-1">Move In Date</Text>
          <Pressable
            className="flex-row items-center justify-between bg-white rounded-xl border border-[#ddd] px-3 py-3 mt-1 w-full"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-[14px] text-[#333]">
              {moveInDate
                ? moveInDate.toLocaleDateString()
                : "Select move in date"}
            </Text>
            <Text className="text-[14px]">📅</Text>
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
        <View className="flex-row gap-3 mb-4 w-full">
          <Input
            label="Bedrooms"
            labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
            placeholder="e.g. 2"
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
            className="bg-white border-[#ddd] text-black"
            containerClassName="flex-1"
          />
          <Input
            label="Bathrooms"
            labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
            placeholder="e.g. 1"
            value={bathrooms}
            onChangeText={setBathrooms}
            keyboardType="numeric"
            className="bg-white border-[#ddd] text-black"
            containerClassName="flex-1"
          />
        </View>

        {/* Security Deposit */}
        <Input
          label="Security Deposit ($)"
          labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
          placeholder="e.g. 1200"
          value={securityDeposit}
          onChangeText={setSecurityDeposit}
          keyboardType="numeric"
          className="bg-white border-[#ddd] text-black"
          containerClassName="w-full mb-4"
        />

        {/* Rent and Lease Term Row */}
        <View className="flex-row gap-3 mb-4 w-full">
          <Input
            label="Rent / month"
            labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
            placeholder="780"
            value={listingRent}
            onChangeText={setListingRent}
            keyboardType="numeric"
            className="bg-white border-[#ddd] text-black"
            containerClassName="flex-1"
          />
          <Input
            label="Lease term text"
            labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
            placeholder="8 months"
            value={listingLeaseTerm}
            onChangeText={setListingLeaseTerm}
            className="bg-white border-[#ddd] text-black"
            containerClassName="flex-1"
          />
        </View>

        {/* Location Area */}
        <Input
          label="Neighborhood / Area"
          labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
          placeholder="e.g. Downtown, Whyte Ave"
          value={locationArea}
          onChangeText={setLocationArea}
          className="bg-white border-[#ddd] text-black"
          containerClassName="w-full mb-4"
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
        <Pressable className="mt-3 rounded-full py-3 items-center justify-center bg-black w-full" onPress={pickImages}>
          <Text className="text-[14px] font-semibold text-white">
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
      <H1 className="text-left mb-1" style={{ textAlign: "left", marginBottom: 4 }}>Create Post</H1>
      <H4 className="text-left text-[#aaa] mb-5" style={{ textAlign: "left", color: "#aaa", marginBottom: 20 }}>Tell others what you&apos;re looking for</H4>

      <Input
        label="Title"
        labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
        placeholder="Looking for a roommate for Fall 2025"
        value={postTitle}
        onChangeText={setPostTitle}
        containerClassName="w-full mb-4"
      />

      <Input
        label="Description"
        labelClassName="text-[#1a1a1a] text-[14px] font-semibold mb-1"
        placeholder="Describe yourself, your preferences, and what you're looking for."
        value={postBody}
        onChangeText={setPostBody}
        multiline
        className="min-h-[120px]"
        style={{ textAlignVertical: "top" }}
        containerClassName="w-full mb-4"
      />

      <Button fullWidth onPress={handleCreatePost} disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </Button>
    </>
  );

  // Loading state
  if (roleLoading) {
    return <LoadingState label="Loading…" />;
  }

  // No role state
  if (!role) {
    return (
      <LoadingState
        label="Could not determine your role. Please re-login."
        showSpinner={false}
      />
    );
  }

  return (
    <Screen scrollable contentContainerClassName="pt-4 pb-[100px] items-center">
      {role === "landlord" ? renderLandlordForm() : renderStudentForm()}
    </Screen>
  );
}
