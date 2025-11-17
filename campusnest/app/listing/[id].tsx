import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabaseClient";

type Role = "student" | "landlord";

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
};

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [landlordName, setLandlordName] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    console.log("ID from router:", id);

    const fetchData = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userRole = session?.user?.user_metadata?.role as Role | undefined;
      if (userRole === "student" || userRole === "landlord") {
        setRole(userRole);
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Listing detail error:", error);
        Alert.alert("Error", "Could not load listing.");
        setLoading(false);
        return;
      }

      setListing(data as Listing);

      if (session?.user?.id && data.landlord_id === session.user.id) {
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

      setLoading(false);
    };

    fetchData();
  }, [id]);

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
    <SafeAreaView style={styles.screen}>
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

        {/* Fake image grid */}
        <View style={styles.imageRow}>
          <View style={styles.mainImage}>
            <Text style={styles.imageEmoji}>🏠</Text>
          </View>
          <View style={styles.sideImages}>
            <View style={styles.sideImage} />
            <View style={styles.sideImage} />
            <View style={styles.morePhotos}>
              <Text style={styles.morePhotosText}>More Photos</Text>
            </View>
          </View>
        </View>

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

        {/* TODO: Map placeholder */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
    maxWidth: 480,
    alignSelf: "center",
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
    flex: 2,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  imageEmoji: {
    fontSize: 40,
  },
  sideImages: {
    flex: 1,
    justifyContent: "space-between",
  },
  sideImage: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  morePhotos: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#222",
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
});
