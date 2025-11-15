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
import { supabase } from "@/src/lib/supabaseClient";

type Role = "student" | "landlord";

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
type LandlordFilter = "yourListings" | "recent";
type FilterKey = StudentFilter | LandlordFilter;

type Listing = {
  id: string;
  title: string;
  address: string;
  rent: number;
  leaseTerm: string;
  distanceMinutes: number;
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Lease Term: 8 Months (Extend)",
    address: "2190 111-B North Avenue NW Edmonton, AB TH6-2H7",
    rent: 780,
    leaseTerm: "8 Months",
    distanceMinutes: 5,
  },
  {
    id: "2",
    title: "Lease Term: 12 Months",
    address: "1020 Campus Road NW Edmonton, AB TH4-1Z2",
    rent: 820,
    leaseTerm: "12 Months",
    distanceMinutes: 10,
  },
  {
    id: "3",
    title: "Lease Term: 4 Months",
    address: "55 University Drive NW Edmonton, AB TH1-9Q1",
    rent: 700,
    leaseTerm: "4 Months",
    distanceMinutes: 7,
  },
];

export default function HomeScreen() {
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userRole = session?.user?.user_metadata?.role as Role | undefined;

        if (userRole === "student" || userRole === "landlord") {
          setRole(userRole);

          // reset filter default based on role
          setActiveFilter(
            userRole === "student" ? ("new" as FilterKey) : ("yourListings" as FilterKey)
          );
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, []);

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

    const filters: { key: FilterKey; label: string }[] =
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
          const isActive = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
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

  const renderListingCard = ({ item }: { item: Listing }) => (
    <Pressable style={styles.card} onPress={() => { /* TODO: navigate to detail */ }}>
      <View style={styles.cardImagePlaceholder}>
        <Text style={styles.cardImageEmoji}>🏠</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle}>Lease Term: {item.leaseTerm}</Text>
        <Text style={styles.cardSubtitle}>Rent: ${item.rent} per month</Text>
        <Text style={styles.cardAddress} numberOfLines={2}>
          {item.address}
        </Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMetaText}>
            Dist. to Uni: {item.distanceMinutes} min
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (roleLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.centeredText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>
          Couldn&apos;t determine your role. Please log out and log in again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {renderHeader()}
      {renderFilters()}

      <FlatList
        data={MOCK_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderListingCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000", // outer shell to match rest of app
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: 480,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
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
    width: "100%",
    maxWidth: 480,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
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
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardImagePlaceholder: {
    width: 70,
    height: 70,
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
  cardMetaRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  cardMetaText: {
    color: "#fff",
    fontSize: 11,
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  centeredText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
});
