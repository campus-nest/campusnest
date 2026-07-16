import { StyleSheet, Text } from "react-native";
import AddressInput, { LocationData } from "@/components/ui/AddressInput";
import { ChipGroup, ToggleChipGroup } from "@/components/ui/Chip";
import { CycleDropdown } from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";
import DateField from "@/components/listings/DateField";
import SuggestionChip from "@/components/listings/SuggestionChip";
import UploadPhotosButton from "@/components/listings/UploadPhotosButton";
import { ImagePickerPreview } from "@/components/listings/ImagePickerPreview";
import { ListingStatus, ListingVisibility } from "@/src/types/listing";
import { colors, typography } from "@/src/constants/theme";

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

interface ListingFormFieldsProps {
  listingTitle: string;
  setListingTitle: (v: string) => void;
  listingAddress: string;
  setListingAddress: (v: string) => void;
  selectedLocation?: LocationData | null;
  handleLocationSelected: (location: LocationData | null) => void;
  selectedUtilities: string[];
  handleUtilityToggle: (utility: string) => void;
  nearbyUniversity: string;
  setNearbyUniversity: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  tenantPreferences: string;
  setTenantPreferences: (v: string) => void;
  leaseTermOption: string | null;
  setLeaseTermOption: (v: string) => void;
  listingLeaseTerm: string;
  setListingLeaseTerm: (v: string) => void;
  furnishedStatus: string | null;
  setFurnishedStatus: (v: string) => void;
  moveInDate: Date | null;
  setMoveInDate: (v: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (v: boolean) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  bathrooms: string;
  setBathrooms: (v: string) => void;
  securityDeposit: string;
  setSecurityDeposit: (v: string) => void;
  listingRent: string;
  setListingRent: (v: string) => void;
  locationArea: string;
  setLocationArea: (v: string) => void;
  status?: ListingStatus;
  setStatus?: (v: ListingStatus) => void;
  visibility?: ListingVisibility;
  setVisibility?: (v: ListingVisibility) => void;
  existingPhotoUrls?: string[];
  setExistingPhotoUrls?: (updater: (prev: string[]) => string[]) => void;
  photoUris: string[];
  setPhotoUris: (updater: (prev: string[]) => string[]) => void;
  pickImages: () => void;
}

// The full "listing details" field set shared by the create-listing
// (new_post.tsx) and edit-listing (listing/[id]/edit.tsx) forms.
export default function ListingFormFields({
  listingTitle,
  setListingTitle,
  listingAddress,
  setListingAddress,
  selectedLocation,
  handleLocationSelected,
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
  listingLeaseTerm,
  setListingLeaseTerm,
  furnishedStatus,
  setFurnishedStatus,
  moveInDate,
  setMoveInDate,
  showDatePicker,
  setShowDatePicker,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  securityDeposit,
  setSecurityDeposit,
  listingRent,
  setListingRent,
  locationArea,
  setLocationArea,
  status,
  setStatus,
  visibility,
  setVisibility,
  existingPhotoUrls,
  setExistingPhotoUrls,
  photoUris,
  setPhotoUris,
  pickImages,
}: ListingFormFieldsProps) {
  return (
    <Stack gap="lg">
      <Input
        variant="light"
        label="Listing Title"
        placeholder="Cozy 2-bedroom near campus"
        value={listingTitle}
        onChangeText={setListingTitle}
      />

      <AddressInput
        label="Address"
        placeholder="123 University Ave, Edmonton, AB"
        value={listingAddress}
        onChangeText={setListingAddress}
        selectedLocation={selectedLocation}
        onLocationSelected={handleLocationSelected}
        variant="light"
      />

      <Section title="Utilities" variant="light">
        <ChipGroup
          options={UTILITY_OPTIONS}
          selected={selectedUtilities}
          onToggle={handleUtilityToggle}
          variant="light"
        />
      </Section>

      <Stack gap="sm">
        <Input
          variant="light"
          label="Nearby University"
          placeholder="Select college"
          value={nearbyUniversity}
          onChangeText={setNearbyUniversity}
        />
        {nearbyUniversity.length === 0 && (
          <SuggestionChip
            label="University of Alberta"
            onPress={() => setNearbyUniversity("University of Alberta")}
          />
        )}
      </Stack>

      <Input
        variant="light"
        label="Description"
        placeholder="Tell people about your place"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.multiline}
      />

      <Input
        variant="light"
        label="Tenant Preferences"
        placeholder="What do you look for?"
        value={tenantPreferences}
        onChangeText={setTenantPreferences}
        multiline
        style={styles.multiline}
      />

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

      <Section title="Furnishing" variant="light">
        <ToggleChipGroup
          options={FURNISHED_OPTIONS}
          value={furnishedStatus}
          onChange={setFurnishedStatus}
          variant="light"
        />
      </Section>

      <DateField
        label="Move In Date"
        value={moveInDate}
        placeholder="Select move in date"
        show={showDatePicker}
        onOpen={() => setShowDatePicker(true)}
        onChange={(date) => {
          setMoveInDate(date);
          setShowDatePicker(false);
        }}
      />

      <Stack direction="row" gap="md">
        <Input
          variant="light"
          label="Bedrooms"
          placeholder="e.g. 2"
          value={bedrooms}
          onChangeText={setBedrooms}
          keyboardType="numeric"
          containerStyle={{ flex: 1 }}
        />
        <Input
          variant="light"
          label="Bathrooms"
          placeholder="e.g. 1"
          value={bathrooms}
          onChangeText={setBathrooms}
          keyboardType="numeric"
          containerStyle={{ flex: 1 }}
        />
      </Stack>

      <Input
        variant="light"
        label="Security Deposit ($)"
        placeholder="e.g. 1200"
        value={securityDeposit}
        onChangeText={setSecurityDeposit}
        keyboardType="numeric"
      />

      <Stack direction="row" gap="md">
        <Input
          variant="light"
          label="Rent / month"
          placeholder="780"
          value={listingRent}
          onChangeText={setListingRent}
          keyboardType="numeric"
          containerStyle={{ flex: 1 }}
        />
        <Input
          variant="light"
          label="Lease term text"
          placeholder="8 months"
          value={listingLeaseTerm}
          onChangeText={setListingLeaseTerm}
          containerStyle={{ flex: 1 }}
        />
      </Stack>

      <Input
        variant="light"
        label="Neighborhood / Area"
        placeholder="e.g. Downtown, Whyte Ave"
        value={locationArea}
        onChangeText={setLocationArea}
      />

      {setStatus && (
        <CycleDropdown
          label="Listing Status"
          value={status ?? null}
          placeholder="Select status"
          options={STATUS_OPTIONS}
          onChange={(val) => setStatus(val as ListingStatus)}
          variant="light"
        />
      )}

      {setVisibility && (
        <CycleDropdown
          label="Visibility"
          value={visibility ?? null}
          placeholder="Select visibility"
          options={VISIBILITY_OPTIONS}
          onChange={(val) => setVisibility(val as ListingVisibility)}
          variant="light"
        />
      )}

      {existingPhotoUrls && existingPhotoUrls.length > 0 && setExistingPhotoUrls && (
        <Stack gap="sm">
          <Text style={styles.photoLabel}>Existing Photos</Text>
          <ImagePickerPreview
            photos={existingPhotoUrls}
            onRemove={(url) => setExistingPhotoUrls((prev) => prev.filter((p) => p !== url))}
          />
        </Stack>
      )}

      {photoUris.length > 0 && (
        <Stack gap="sm">
          {existingPhotoUrls !== undefined && (
            <Text style={styles.photoLabel}>New Photos to Upload</Text>
          )}
          <ImagePickerPreview
            photos={photoUris}
            onRemove={(uri) => setPhotoUris((prev) => prev.filter((p) => p !== uri))}
          />
        </Stack>
      )}

      <UploadPhotosButton
        hasPhotos={photoUris.length > 0 || (existingPhotoUrls?.length ?? 0) > 0}
        onPress={pickImages}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  photoLabel: {
    color: colors.background.elevated,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
