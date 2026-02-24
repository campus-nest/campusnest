import LandlordListingForm, {
  DEFAULT_LANDLORD_FORM_STATE,
  LandlordFormState,
} from "@/components/listings/LandlordListingForm";
import { PageContainer } from "@/components/page-container";
import StudentPostForm, {
  DEFAULT_STUDENT_POST_STATE,
  StudentPostFormState,
} from "@/components/posts/StudentPostForm";
import LoadingState from "@/components/ui/LoadingState";
import { useRole } from "@/src/hooks/useRole";
import { authService, listingService, postService } from "@/src/services";
import { spacing } from "@/src/theme/spacing";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

export default function NewPostScreen() {
  const router = useRouter();
  const { role, loading: roleLoading } = useRole();

  const [submitting, setSubmitting] = useState(false);
  const [listingState, setListingState] = useState<LandlordFormState>(
    DEFAULT_LANDLORD_FORM_STATE,
  );
  const [postState, setPostState] = useState<StudentPostFormState>(
    DEFAULT_STUDENT_POST_STATE,
  );

  // Generic key setter for form state objects
  const handleListingChange = <K extends keyof LandlordFormState>(
    key: K,
    value: LandlordFormState[K],
  ) => setListingState((prev) => ({ ...prev, [key]: value }));

  const handlePostChange = <K extends keyof StudentPostFormState>(
    key: K,
    value: StudentPostFormState[K],
  ) => setPostState((prev) => ({ ...prev, [key]: value }));

  const handleCreateListing = async () => {
    const { listingTitle, listingAddress, listingRent, leaseTermOption, listingLeaseTerm, utilities, photoUris } = listingState;

    if (!listingTitle || !listingAddress || !listingRent || (!leaseTermOption && !listingLeaseTerm)) {
      Alert.alert("Missing info", "Please fill in all required fields.");
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

      const utilitiesSelected = Object.entries(utilities)
        .filter(([, on]) => on)
        .map(([key]) => key)
        .join(", ");

      const uploadedUrls = await listingService.uploadListingPhotos(user.id, photoUris);

      const result = await listingService.createListing({
        landlord_id: user.id,
        title: listingTitle,
        address: listingAddress,
        rent: rentNumber,
        lease_term: leaseTermOption || listingLeaseTerm,
        status: "active",
        visibility: "public",
        utilities: utilitiesSelected || null,
        nearby_university: listingState.nearbyUniversity || null,
        description: listingState.description || null,
        tenant_preferences: listingState.tenantPreferences || null,
        is_furnished: listingState.isFurnished,
        move_in_date: listingState.moveInDate ? listingState.moveInDate.toISOString() : null,
        location_area: listingState.locationArea || null,
        photo_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
      });

      if (!result.success) {
        Alert.alert("Error", result.error || "Could not create listing.");
        return;
      }

      // Reset form
      setListingState(DEFAULT_LANDLORD_FORM_STATE);
      Alert.alert("Success", "Listing created.");
      router.push("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    const { postTitle, postBody } = postState;

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

      setPostState(DEFAULT_STUDENT_POST_STATE);
      Alert.alert("Success", "Post created.");
      router.push("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newUris = result.assets.map((a) => a.uri);
        setListingState((prev) => ({
          ...prev,
          photoUris: Array.from(new Set([...prev.photoUris, ...newUris])),
        }));
      }
    } catch (e) {
      console.error("Image pick error:", e);
      Alert.alert("Error", "Could not pick images.");
    }
  };

  if (roleLoading) {
    return <LoadingState label="Loading..." />;
  }

  if (!role) {
    return (
      <LoadingState
        label="Could not determine your role. Please re-login."
        showSpinner={false}
      />
    );
  }

  return (
    <PageContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "landlord" ? (
          <LandlordListingForm
            state={listingState}
            onChange={handleListingChange}
            onPickImages={pickImages}
            onSubmit={handleCreateListing}
            submitting={submitting}
          />
        ) : (
          <StudentPostForm
            state={postState}
            onChange={handlePostChange}
            onSubmit={handleCreatePost}
            submitting={submitting}
          />
        )}
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.base,
  },
});
