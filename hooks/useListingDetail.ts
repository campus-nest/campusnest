import { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { authService, listingService, profileService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { Profile } from "@/src/types/profile";

export function useListingDetail(id: string | undefined) {
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [landlordName, setLandlordName] = useState<string | null>(null);
  const [landlordProfile, setLandlordProfile] = useState<Profile | null>(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await authService.getSession();
        const listingData = await listingService.getListingById(id);

        if (!listingData) {
          Alert.alert("Error", "Could not load listing.");
          return;
        }

        setListing(listingData);

        if (session?.user?.id === listingData.landlord_id) {
          setIsOwner(true);
        }

        try {
          const profile = await profileService.getProfileById(listingData.landlord_id);
          setLandlordProfile(profile);
          setLandlordName(profile?.full_name || "Landlord");
        } catch {
          setLandlordName("Landlord");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleContact = () => {
    setContactModalVisible(true);
  };

  const handleCall = async (phone: string) => {
    try {
      const url = `tel:${phone.replace(/[^0-9+]/g, "")}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Not Supported", "Direct calling is not supported on this device.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not place a call.");
    }
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await Clipboard.setStringAsync(email);
      Alert.alert("Copied", "Email address copied to clipboard!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to copy email.");
    }
  };

  const handleEdit = () => {
    if (!id) return;
    router.push(`/listing/${id}/edit`);
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const result = await listingService.deleteListing(id);
              if (result.success) {
                router.replace("/(tabs)");
              } else {
                Alert.alert("Error", result.error ?? "Failed to delete listing.");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Something went wrong while deleting.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return {
    listing,
    landlordName,
    landlordProfile,
    contactModalVisible,
    setContactModalVisible,
    isOwner,
    loading,
    deleting,
    handleContact,
    handleCall,
    handleCopyEmail,
    handleEdit,
    handleDelete,
    handleBack,
  };
}
