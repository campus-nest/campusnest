import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PageContainer } from "@/components/page-container";
import { useRouter } from "expo-router";
import { authService, listingService } from "@/src/services";
import { Listing } from "@/src/types/listing";

type Role = "student" | "landlord";

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
type LandlordFilter = "yourListings" | "recent";
type FilterKey = StudentFilter | LandlordFilter;

export default function HomeScreen() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await authService.getUserRole();
        if (userRole) {
          setRole(userRole);
          setActiveFilter(userRole === "student" ? "new" : "yourListings");
        }
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    if (!role) return;

    const fetchListings = async () => {
      setListingsLoading(true);
      const session = await authService.getSession();

      let data: Listing[] = [];

      if (role === "student") {
        data = await listingService.getListings({
          status: "active",
          visibility: "public",
        });
      } else {
        data =
          activeFilter === "yourListings"
            ? await listingService.getListings({
                landlord_id: session?.user?.id,
              })
            : await listingService.getListings({
                status: "active",
                visibility: "public",
              });
      }

      setListings(data);
      setListingsLoading(false);
    };

    fetchListings();
  }, [role, activeFilter]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search listings"
        placeholderTextColor="#999"
      />
      <Pressable style={styles.iconButton}>
        <Text style={styles.iconText}>🔔</Text>
      </Pressable>
    </View>
  );

  const renderFilters = () => {
    if (!role) return null;

    const filters =
      role === "student"
        ? [
            { key: "new", label: "New" },
            { key: "closest", label: "Closest" },
            { key: "cheapest", label: "Cheapest" },
            { key: "moveIn", label: "Move-In" },
          ]
        : [
            { key: "yourListings", label: "Your Listings" },
            { key: "recent", label: "Recent" },
          ];

    return (
      <View style={styles.filtersRow}>
        {filters.map((f) => {
          const active = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key as FilterKey)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderListingCard = (listing: Listing) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      <View style={styles.cardImage}>
        <Text style={styles.cardImageEmoji}>🏠</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{listing.title}</Text>
        <Text style={styles.cardSubtitle}>
          Lease Term: {listing.lease_term}
        </Text>
        <Text style={styles.cardSubtitle}>Rent: ${listing.rent}</Text>
        <Text style={styles.cardAddress} numberOfLines={2}>
          {listing.address}
        </Text>
      </View>
    </Pressable>
  );

  if (roleLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Checking your role...</Text>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>
          No role found — please re-login.
        </Text>
      </View>
    );
  }

  if (listingsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading listings...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        {renderHeader()}
        {renderFilters()}

        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderListingCard(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#000",
  },
  filterChipText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingBottom: 60,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardImageEmoji: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#ddd",
    fontSize: 12,
  },
  cardAddress: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
  },
});
