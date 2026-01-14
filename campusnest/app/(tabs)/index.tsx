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
import { getSupabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";

type Role = "student" | "landlord";

type StudentFilter = "new" | "closest" | "cheapest" | "moveIn";
type LandlordFilter = "yourListings" | "recent";
type FilterKey = StudentFilter | LandlordFilter;

type Listing = {
  id: string;
  landlord_id: string;
  title: string;
  address: string;
  rent: number;
  lease_term: string;
  created_at: string;
  photo_urls?: string[] | null;
};

type Post = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
};

type FeedItem =
  | { type: "listing"; created_at: string; item: Listing }
  | { type: "post"; created_at: string; item: Post };

export default function HomeScreen() {
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [listingsLoading, setListingsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const router = useRouter();

  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const supabase = getSupabase();

    const fetchRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userRole = session?.user?.user_metadata?.role as Role | undefined;

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

    const supabase = getSupabase();

    const fetchFeed = async () => {
      setListingsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 1) Listings query
      let listingsQuery = supabase
        .from("listings")
        .select(
          "id, landlord_id, title, address, rent, lease_term, created_at, photo_urls",
        );

      if (role === "student") {
        // students see public active listings
        listingsQuery = listingsQuery
          .eq("status", "active")
          .eq("visibility", "public");
      } else {
        // landlord
        if (activeFilter === "yourListings") {
          listingsQuery = listingsQuery.eq("landlord_id", session?.user?.id);
        } else {
          // "recent" should show public listings from everyone
          listingsQuery = listingsQuery
            .eq("status", "active")
            .eq("visibility", "public");
        }
      }

      const { data: listingsData, error: listingsError } =
        await listingsQuery.order("created_at", { ascending: false });

      if (listingsError) {
        console.error("Listing fetch error:", listingsError);
      }

      // 2) Posts query (for both students + landlords)
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, user_id, title, body, created_at")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Posts fetch error:", postsError);
      }

      const safeListings = (listingsData ?? []) as Listing[];
      const safePosts = (postsData ?? []) as Post[];

      // 3) Merge into one feed sorted by created_at
      const merged: FeedItem[] = [
        ...safeListings.map((l) => ({
          type: "listing" as const,
          created_at: l.created_at,
          item: l,
        })),
        ...safePosts.map((p) => ({
          type: "post" as const,
          created_at: p.created_at,
          item: p,
        })),
      ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      setFeed(merged);
      setListingsLoading(false);
    };

    fetchFeed();
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
              style={[styles.filterChip, isActive && styles.filterChipActive]}
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

  const renderListingCard = (listing: Listing) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      <View style={styles.cardImagePlaceholder}>
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

  const renderPostCard = (post: Post) => (
    <Pressable
      style={[styles.card, { flexDirection: "column" }]}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      <Text style={styles.cardTitle}>{post.title}</Text>

      <Text style={[styles.cardSubtitle, { marginTop: 6 }]} numberOfLines={4}>
        {post.body}
      </Text>

      <Text style={styles.postMeta}>
        {new Date(post.created_at).toLocaleDateString()}
      </Text>
    </Pressable>
  );

  // Loading States
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
        <Text style={styles.centeredText}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <View style={styles.screen}>
        <View style={styles.contentWrapper}>
          {renderHeader()}
          {renderFilters()}

          <FlatList
            data={feed}
            keyExtractor={(x) => `${x.type}-${x.item.id}`}
            renderItem={({ item }) =>
              item.type === "listing"
                ? renderListingCard(item.item)
                : renderPostCard(item.item)
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 10,
  },

  contentWrapper: {
    width: "100%",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
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
    paddingTop: 10,
    paddingBottom: 16,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#aaa",
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
    paddingBottom: 50,
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

  cardContent: {
    flex: 1,
  },

  cardImageEmoji: {
    fontSize: 28,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  centeredText: {
    color: "#fff",
    marginTop: 10,
  },
  postMeta: {
    color: "#888",
    fontSize: 11,
    marginTop: 8,
  },
});
