import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { authService, listingService, profileService } from "@/src/services";
import { Listing } from "@/src/types/listing";
import { ListingImageGallery } from "@/components/listings/ListingImageGallery";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [landlordName, setLandlordName] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

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
    Alert.alert("Contact landlord", "Contact options will be added soon.");
  };

  const handleEdit = () => {
    Alert.alert("Edit listing", "Edit flow coming soon.");
  };

  if (loading || !listing) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.loadingText}>Loading listing…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={22} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image gallery */}
        <ListingImageGallery photos={listing.photo_urls ?? []} />

        {/* Content */}
        <View style={styles.content}>
          {/* Title + rent */}
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.rent}>${listing.rent}<Text style={styles.rentSuffix}> / month</Text></Text>

          {/* Key details row */}
          {(listing.bedrooms != null || listing.bathrooms != null) && (
            <View style={styles.detailsRow}>
              {listing.bedrooms != null && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipText}>{listing.bedrooms} bed</Text>
                </View>
              )}
              {listing.bathrooms != null && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipText}>{listing.bathrooms} bath</Text>
                </View>
              )}
              {listing.lease_term && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipText}>{listing.lease_term}</Text>
                </View>
              )}
            </View>
          )}

          {/* Address */}
          <Text style={styles.address}>{listing.address}</Text>

          {/* Info list */}
          <View style={styles.card}>
            {listing.security_deposit != null && (
              <InfoRow label="Security deposit" value={`$${listing.security_deposit}`} />
            )}
            {listing.utilities && (
              <InfoRow label="Utilities" value={listing.utilities} />
            )}
            {listing.move_in_date && (
              <InfoRow
                label="Move-in date"
                value={new Date(listing.move_in_date).toLocaleDateString()}
              />
            )}
            {listing.nearby_university && (
              <InfoRow label="Nearby university" value={listing.nearby_university} last />
            )}
          </View>

          {/* Description */}
          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{listing.description}</Text>
            </View>
          )}

          {/* Listed by */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Listed by</Text>
            <Text style={styles.cardValue}>{landlordName || "Landlord"}</Text>
          </View>

          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>📍 Map coming soon</Text>
          </View>

          {/* CTA button */}
          <Pressable
            style={styles.ctaButton}
            onPress={isOwner ? handleEdit : handleContact}
          >
            <Text style={styles.ctaButtonText}>
              {isOwner ? "Edit listing" : "Contact landlord"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  rent: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  rentSuffix: {
    fontSize: 15,
    fontWeight: "400",
    color: "#888",
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailChip: {
    backgroundColor: "#1a1a1a",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  detailChipText: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "500",
  },
  address: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e1e1e",
  },
  cardLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    color: "#e0e0e0",
    fontSize: 15,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e1e",
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    color: "#666",
    fontSize: 13,
  },
  infoValue: {
    color: "#e0e0e0",
    fontSize: 13,
    fontWeight: "500",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bodyText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 22,
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: 14,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: "#555",
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  ctaButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});