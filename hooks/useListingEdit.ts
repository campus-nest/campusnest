import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { authService, listingService } from "@/src/services";
import { ListingStatus, ListingVisibility } from "@/src/types/listing";
import { LocationData } from "@/components/ui/AddressInput";

const LEASE_TERM_OPTIONS = [
  { label: "4 months", value: "4 months" },
  { label: "8 months", value: "8 months" },
  { label: "12 months", value: "12 months" },
];

export function useListingEdit(listingId: string | undefined) {
  const router = useRouter();

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
    null
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
          (opt) => opt.value === listing.lease_term
        );
        setLeaseTermOption(match ? match.value : null);

        setFurnishedStatus(
          listing.is_furnished === true
            ? "furnished"
            : listing.is_furnished === false
            ? "unfurnished"
            : null
        );

        setMoveInDate(listing.move_in_date ? new Date(listing.move_in_date) : null);
        setLocationArea(listing.location_area ?? "");
        setExistingPhotoUrls(listing.photo_urls ?? []);

        setBedrooms(listing.bedrooms != null ? String(listing.bedrooms) : "");
        setBathrooms(listing.bathrooms != null ? String(listing.bathrooms) : "");
        setSecurityDeposit(
          listing.security_deposit != null ? String(listing.security_deposit) : ""
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
  }, [listingId, router]);

  // Utility toggle handler
  const handleUtilityToggle = (utility: string) => {
    setSelectedUtilities((prev) =>
      prev.includes(utility)
        ? prev.filter((u) => u !== utility)
        : [...prev, utility]
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
        "Please enter an address or select a location on the map."
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
        "Please select your listing location on the map."
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
          photoUris
        );
      }

      // Combine remaining existing photos with new ones
      const finalPhotoUrls = [...existingPhotoUrls, ...uploadedUrls];

      const result = await listingService.updateListing(listingId!, {
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

  return {
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
  };
}
