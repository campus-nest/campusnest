import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Divider } from "@/components/ui/Section";
import Input from "@/components/ui/Input";
import LoadingState from "@/components/ui/LoadingState";
import Screen from "@/components/ui/Screen";
import ScreenHeading from "@/components/ui/ScreenHeading";
import Stack from "@/components/ui/Stack";
import TabSelector from "@/components/ui/TabSelector";
import ListingFormFields from "@/components/listings/ListingFormFields";
import { useNewPost } from "@/hooks/useNewPost";

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

  const landlordForm = (): ReactNode => (
    <Stack gap="lg" align="stretch">
      <ScreenHeading title="Create Listing" subtitle="Share a place students can rent" align="left" />

      <Card variant="light">
        <Stack gap="lg">
          <TabSelector
            tabs={[
              { label: "Rent", value: "rent" },
              { label: "Price", value: "price" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="light"
          />

          <Divider variant="light" />

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
            photoUris={photoUris}
            setPhotoUris={setPhotoUris}
            pickImages={pickImages}
          />
        </Stack>
      </Card>

      <Button fullWidth onPress={handleCreateListing} disabled={submitting}>
        {submitting ? "Publishing..." : "Publish listing"}
      </Button>
    </Stack>
  );

  const studentForm = (): ReactNode => (
    <Stack gap="lg" align="stretch">
      <ScreenHeading
        title="Create Post"
        subtitle="Tell others what you're looking for"
        align="left"
      />

      <Input
        label="Title"
        placeholder="Looking for a roommate for Fall 2025"
        value={postTitle}
        onChangeText={setPostTitle}
      />

      <Input
        label="Description"
        placeholder="Describe yourself, your preferences, and what you're looking for."
        value={postBody}
        onChangeText={setPostBody}
        multiline
        style={{ minHeight: 120, textAlignVertical: "top" }}
      />

      <Button fullWidth onPress={handleCreatePost} disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </Button>
    </Stack>
  );

  if (roleLoading) return <LoadingState label="Loading..." />;
  if (!role) return <LoadingState label="Could not determine your role. Please re-login." showSpinner={false} />;

  return (
    <Screen scrollable>
      {role === "landlord" ? landlordForm() : studentForm()}
    </Screen>
  );
}
