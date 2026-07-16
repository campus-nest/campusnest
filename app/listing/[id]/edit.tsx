import { useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import ListingFormFields from "@/components/listings/ListingFormFields";
import { useListingEdit } from "@/hooks/useListingEdit";

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    loading,
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
    existingPhotoUrls,
    setExistingPhotoUrls,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    securityDeposit,
    setSecurityDeposit,
    status,
    setStatus,
    visibility,
    setVisibility,
    showDatePicker,
    setShowDatePicker,
    selectedLocation,
    handleLocationSelected,
    pickImages,
    handleSave,
  } = useListingEdit(id);

  if (loading) return <LoadingState label="Loading listing details..." />;

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <ScreenHeading
          title="Edit Listing"
          subtitle="Update the details of your property"
          align="left"
        />

        <Card variant="light">
          <ListingFormFields
            listingTitle={listingTitle}
            setListingTitle={setListingTitle}
            listingAddress={listingAddress}
            setListingAddress={setListingAddress}
            selectedLocation={selectedLocation}
            handleLocationSelected={handleLocationSelected}
            selectedUtilities={selectedUtilities}
            handleUtilityToggle={handleUtilityToggle}
            nearbyUniversity={nearbyUniversity}
            setNearbyUniversity={setNearbyUniversity}
            description={description}
            setDescription={setDescription}
            tenantPreferences={tenantPreferences}
            setTenantPreferences={setTenantPreferences}
            leaseTermOption={leaseTermOption}
            setLeaseTermOption={setLeaseTermOption}
            listingLeaseTerm={listingLeaseTerm}
            setListingLeaseTerm={setListingLeaseTerm}
            furnishedStatus={furnishedStatus}
            setFurnishedStatus={setFurnishedStatus}
            moveInDate={moveInDate}
            setMoveInDate={setMoveInDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            securityDeposit={securityDeposit}
            setSecurityDeposit={setSecurityDeposit}
            listingRent={listingRent}
            setListingRent={setListingRent}
            locationArea={locationArea}
            setLocationArea={setLocationArea}
            status={status}
            setStatus={setStatus}
            visibility={visibility}
            setVisibility={setVisibility}
            existingPhotoUrls={existingPhotoUrls}
            setExistingPhotoUrls={setExistingPhotoUrls}
            photoUris={photoUris}
            setPhotoUris={setPhotoUris}
            pickImages={pickImages}
          />
        </Card>

        <Button fullWidth onPress={handleSave} disabled={submitting}>
          {submitting ? "Saving changes..." : "Save Changes"}
        </Button>
      </Stack>
    </Screen>
  );
}
