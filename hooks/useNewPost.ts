import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { authService, listingService, postService } from "@/src/services";
import { LocationData } from "@/components/ui/AddressInput";

export type Role = "student" | "landlord";

export function useNewPost() {
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
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");

  // Location state (from map picker)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
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
    setBedrooms("");
    setBathrooms("");
    setSecurityDeposit("");
  };

  // Create listing handler
  const handleCreateListing = async () => {
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
        "Please select your listing location on the map so students can find it easily.",
        [{ text: "OK" }]
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
        photoUris
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
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        security_deposit: securityDeposit ? parseFloat(securityDeposit) : null,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not create listing.");
        return;
      }

      resetLandlordForm();
      Alert.alert(
        "Success",
        "Listing created! It will now appear on the map for students."
      );
      router.push("/(tabs)");
    } catch (err) {
      console.error("Listing create error:", err);
      Alert.alert("Error", "Could not create listing.");
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
    } catch (err) {
      console.error("Post create error:", err);
      Alert.alert("Error", "Could not create post.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelected = (location: LocationData | null) => {
    setSelectedLocation(location);
  };

  return {
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
  };
}
