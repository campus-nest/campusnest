import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getSupabase } from "@/src/lib/supabaseClient";
import { PageContainer } from "@/components/page-container";

type Listing = {
  id: string;
  landlord_id: string;
  title: string;
  address: string;
  rent: number;
  lease_term: string;
  utilities?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  move_in_date?: string | null;
  status: string;
  visibility: string;
  description?: string | null;
  security_deposit?: number | null;
  nearby_university?: string | null;
  is_furnished?: boolean | null;
  photo_urls?: string[] | null;
};

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [landlordName, setLandlordName] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          console.error("Listing detail error:", error);
          Alert.alert("Error", "Could not load listing.");
          return;
        }

        setListing(data as Listing);

        if (session?.user?.id === data.landlord_id) {
          setIsOwner(true);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.landlord_id)
          .single();

        if (profile?.full_name) {
          setLandlordName(profile.full_name);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, supabase]);

  const handleContact = () => {
    Alert.alert(
      "Contact landlord",
      "Contact options (email/phone) will be wired up next."
    );
  };

  const handleEdit = () => {
    Alert.alert("Edit listing", "Edit flow will be implemented later.");
  };

  if (loading || !listing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading listing...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View />
        </View>

        {/* Image grid */}
        {listing.photo_urls && listing.photo_urls.length > 0 ? (
          <View style={styles.imageRow}>
            <Image
              source={{ uri: listing.photo_urls[0] }}
              style={styles.mainImage}
              resizeMode="cover"
            />

            <View style={styles.sideImages}>
              {listing.photo_urls.slice(1, 3).map((url, idx) => (
                <Image
                  key={idx}
                  source={{ uri: url }}
                  style={styles.sideImage}
                  resizeMode="cover"
                />
              ))}

              {listing.photo_urls.length > 3 && (
                <View style={styles.morePhotos}>
                  <Text style={styles.morePhotosText}>
                    +{listing.photo_urls.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.mainImage}>
            <Text style={styles.imageEmoji}>🏠</Text>
          </View>
        )}

        {/* Content */}
        <Text style={styles.title}>{listing.title}</Text>

        <Text style={styles.detailText}>
          Rent: ${listing.rent} per month
        </Text>

        <Text style={styles.detailText}>
          Lease Term: {listing.lease_term}
        </Text>

        {listing.security_deposit != null && (
          <Text style={styles.detailText}>
            Security deposit: ${listing.security_deposit}
          </Text>
        )}

        {listing.bedrooms != null && listing.bathrooms != null && (
          <Text style={styles.detailText}>
            Details: {listing.bedrooms} bed, {listing.bathrooms} bath
          </Text>
        )}

        {listing.utilities && (
          <Text style={styles.detailText}>
            Utilities: {listing.utilities}
          </Text>
        )}

        {listing.move_in_date && (
          <Text style={styles.detailText}>
            Move in date:{" "}
            {new Date(listing.move_in_date).toLocaleDateString()}
          </Text>
        )}

        <Text style={[styles.detailText, styles.addressText]}>
          {listing.address}
        </Text>

        {listing.description && (
          <>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.bodyText}>{listing.description}</Text>
          </>
        )}

        {listing.nearby_university && (
          <Text style={styles.detailText}>
            Nearby university: {listing.nearby_university}
          </Text>
        )}

        {/* Listed by */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Listed by</Text>
          <Text style={styles.bodyText}>{landlordName ?? "Landlord"}</Text>
        </View>

        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map placeholder</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {isOwner ? (
            <Pressable style={styles.primaryButton} onPress={handleEdit}>
              <Text style={styles.primaryButtonText}>Edit listing</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={handleContact}>
              <Text style={styles.primaryButtonText}>Contact landlord</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    color: "#fff",
    fontSize: 22,
  },
  imageRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  mainImage: {
    width: "65%",
    height: 140,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  sideImages: {
    width: "35%",
    justifyContent: "space-between",
  },
  sideImage: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    marginBottom: 6,
  },
  morePhotos: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  morePhotosText: {
    color: "#fff",
    fontSize: 11,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  detailText: {
    color: "#ddd",
    fontSize: 13,
  },
  addressText: {
    marginTop: 4,
    marginBottom: 8,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  bodyText: {
    color: "#ccc",
    fontSize: 13,
  },
  mapPlaceholder: {
    marginTop: 16,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: "#777",
  },
  actionsRow: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryButtonText: {
    fontWeight: "600",
  },
  imageEmoji: {
    fontSize: 50,
  },
});
