import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { getSupabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { PageContainer } from "@/components/page-container";
import * as FileSystem from "expo-file-system/legacy";
import DateTimePicker from "@react-native-community/datetimepicker";

type Role = "student" | "landlord";

/**
 * NewPostScreen
 * - Landlord: Create Listing
 * - Student: Create Post
 */
export default function NewPostScreen() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // landlord form state (simplified first version)
  const [listingTitle, setListingTitle] = useState("");
  const [listingAddress, setListingAddress] = useState("");
  const [listingRent, setListingRent] = useState("");
  const [listingLeaseTerm, setListingLeaseTerm] = useState("");
  const supabase = getSupabase();

  const [utilities, setUtilities] = useState({
    electricity: false,
    water: false,
    internet: false,
    heating: false,
    wifi: false,
    heat: false,
  });

  const [nearbyUniversity, setNearbyUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [tenantPreferences, setTenantPreferences] = useState("");
  const [leaseTermOption, setLeaseTermOption] = useState<string | null>(null);
  const [isFurnished, setIsFurnished] = useState<boolean | null>(null);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [locationArea, setLocationArea] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"rent" | "price">("rent");

  // student post form state (simplified)
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch role
  useEffect(() => {
    const loadRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const r = session?.user?.user_metadata?.role as Role | undefined;
        if (r === "student" || r === "landlord") {
          setRole(r);
        } else {
          setRole(null);
        }
      } finally {
        setRoleLoading(false);
      }
    };

    loadRole();
  }, [supabase]);

  // Handlers
  const handleCreateListing = async () => {
    if (
      !listingTitle ||
      !listingAddress ||
      !listingRent ||
      (!leaseTermOption && !listingLeaseTerm)
    ) {
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
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      const utilitesSelected = Object.entries(utilities)
        .filter(([, on]) => on)
        .map(([key]) => key)
        .join(", ");

      //upload photos to supabase
      const uploadedUrls: string[] = [];

      for (const uri of photoUris) {
        const fileExt = uri.split(".").pop() || "jpg";
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `listings/${session.user.id}/${fileName}`;

        const uploadResult = await FileSystem.uploadAsync(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/listing_photos/${filePath}`,
          uri,
          {
            httpMethod: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": `image/${fileExt}`,
            },
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          },
        );

        if (uploadResult.status !== 200) {
          throw new Error("Upload failed");
        }

        const { data } = supabase.storage
          .from("listing_photos")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      const { error } = await supabase.from("listings").insert({
        landlord_id: session.user.id,
        title: listingTitle,
        address: listingAddress,
        rent: rentNumber,
        lease_term: leaseTermOption || listingLeaseTerm,
        status: "active",
        visibility: "public",

        utilities: utilitesSelected || null,
        nearby_university: nearbyUniversity || null,
        description: description || null,
        tenant_preferences: tenantPreferences || null,
        is_furnished: isFurnished,
        move_in_date: moveInDate ? moveInDate.toISOString() : null,
        location_area: locationArea || null,
        photo_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
      });

      if (error) {
        console.error("Create listing error:", error);
        Alert.alert("Error", "Could not create listing.");
        return;
      }

      // reset form
      setListingTitle("");
      setListingAddress("");
      setListingRent("");
      setListingLeaseTerm("");

      setUtilities({
        electricity: false,
        water: false,
        internet: false,
        heating: false,
        wifi: false,
        heat: false,
      });
      setNearbyUniversity("");
      setDescription("");
      setTenantPreferences("");
      setLeaseTermOption(null);
      setIsFurnished(null);
      setMoveInDate(null);
      setLocationArea("");
      setPhotoUris([]);
      setActiveTab("rent");

      Alert.alert("Success", "Listing created.");
      router.push("/(tabs)"); // back to home feed
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle || !postBody) {
      Alert.alert("Missing info", "Please enter a title and description.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        Alert.alert("Error", "Could not get current user.");
        return;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: session.user.id,
        title: postTitle,
        body: postBody,
      });

      if (error) {
        console.error("Create post error:", error);
        Alert.alert("Error", "Could not create post.");
        return;
      }

      setPostTitle("");
      setPostBody("");

      Alert.alert("Success", "Post created.");
      router.push("/(tabs)"); // back to home
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
        setPhotoUris((prev) => [...prev, ...newUris]);
      }
    } catch (e) {
      console.error("Image pick error:", e);
      Alert.alert("Error", "Could not pick images.");
    }
  };

  // Render pieces
  const renderLandlordForm = () => (
    <>
      <Text style={styles.title}>Create Listing</Text>
      <Text style={styles.subtitle}>Share a place students can rent</Text>

      {/* Card container (light grey background) */}
      <View style={styles.formCard}>
        {/* Rent / Price Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setActiveTab("rent")}
            style={[styles.tab, activeTab === "rent" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rent" && styles.tabTextActive,
              ]}
            >
              Rent
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("price")}
            style={[styles.tab, activeTab === "price" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "price" && styles.tabTextActive,
              ]}
            >
              Price
            </Text>
          </Pressable>
        </View>

        <View style={styles.cardDivider} />

        {/* LISTING TITLE */}
        <View style={styles.field}>
          <Text style={styles.label}>Listing Title</Text>
          <TextInput
            style={styles.inputLight}
            placeholder="Cozy 2-bedroom near campus"
            placeholderTextColor="#777"
            value={listingTitle}
            onChangeText={setListingTitle}
          />
        </View>

        {/* LISTING ADDRESS */}
        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.inputLight}
            placeholder="123 University Ave"
            placeholderTextColor="#777"
            value={listingAddress}
            onChangeText={setListingAddress}
          />
        </View>

        {/* UTILITIES */}
        <Text style={styles.sectionTitle}>Utilities</Text>
        <View style={styles.utilitiesGrid}>
          {["electricity", "water", "wifi", "heat"].map((key) => {
            const typedKey = key as keyof typeof utilities;
            const label =
              key === "wifi"
                ? "Wifi"
                : key.charAt(0).toUpperCase() + key.slice(1);

            const selected = utilities[typedKey];

            return (
              <Pressable
                key={key}
                onPress={() =>
                  setUtilities((prev) => ({
                    ...prev,
                    [typedKey]: !prev[typedKey],
                  }))
                }
                style={[
                  styles.utilityChip,
                  selected && styles.utilityChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.utilityChipText,
                    selected && styles.utilityChipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* NEARBY UNIVERSITY */}
        <View style={styles.field}>
          <Text style={styles.label}>Nearby University</Text>
          <TextInput
            style={styles.inputLight}
            placeholder="Select college"
            placeholderTextColor="#777"
            value={nearbyUniversity}
            onChangeText={setNearbyUniversity}
          />

          {/* simple suggestion list */}
          {nearbyUniversity.length === 0 && (
            <Pressable
              style={styles.universitySuggestionBox}
              onPress={() => setNearbyUniversity("University of Alberta")}
            >
              <Text style={styles.universitySuggestionText}>
                University of Alberta
              </Text>
            </Pressable>
          )}
        </View>

        {/* DESCRIPTION */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.inputLight, styles.multilineInput]}
            placeholder="Tell people about your place"
            placeholderTextColor="#777"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* TENANT PREFERENCES */}
        <View style={styles.field}>
          <Text style={styles.label}>Tenant Preferences</Text>
          <TextInput
            style={[styles.inputLight, styles.multilineInput]}
            placeholder="What do you look for?"
            placeholderTextColor="#777"
            value={tenantPreferences}
            onChangeText={setTenantPreferences}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* LEASE TERM OPTION (dropdown) */}
        <View style={styles.field}>
          <Text style={styles.label}>Lease Term</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => {
              const options = ["4 months", "8 months", "12 months"];
              const idx = options.indexOf(leaseTermOption || "");
              const next = options[(idx + 1) % options.length];
              setLeaseTermOption(next);
              setListingLeaseTerm(next);
            }}
          >
            <Text style={styles.dropdownText}>
              {leaseTermOption || "Select lease term"}
            </Text>
            <Text style={styles.dropdownChevron}>⌄</Text>
          </Pressable>
        </View>

        {/* FURNISHED / UNFURNISHED */}
        <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleChip,
              isFurnished === true && styles.toggleChipActive,
            ]}
            onPress={() => setIsFurnished(true)}
          >
            <Text
              style={[
                styles.toggleChipText,
                isFurnished === true && styles.toggleChipTextActive,
              ]}
            >
              Furnished
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.toggleChip,
              isFurnished === false && styles.toggleChipActive,
            ]}
            onPress={() => setIsFurnished(false)}
          >
            <Text
              style={[
                styles.toggleChipText,
                isFurnished === false && styles.toggleChipTextActive,
              ]}
            >
              Unfurnished
            </Text>
          </Pressable>
        </View>

        {/* MOVE IN DATE */}
        {/* MOVE IN DATE */}
        <View style={styles.field}>
          <Text style={styles.label}>Move In Date</Text>

          <Pressable
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dropdownText}>
              {moveInDate
                ? moveInDate.toLocaleDateString()
                : "Select move in date"}
            </Text>
            <Text style={styles.dropdownChevron}>📅</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={moveInDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setMoveInDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* EXISTING FIELDS (Rent + Lease term text) */}
        <View style={styles.inlineRow}>
          <View style={[styles.field, styles.inlineField]}>
            <Text style={styles.label}>Rent / month</Text>
            <TextInput
              style={styles.inputLight}
              placeholder="780"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={listingRent}
              onChangeText={setListingRent}
            />
          </View>

          <View style={[styles.field, styles.inlineField]}>
            <Text style={styles.label}>Lease term text (display)</Text>
            <TextInput
              style={styles.inputLight}
              placeholder="8 months"
              placeholderTextColor="#777"
              value={listingLeaseTerm}
              onChangeText={setListingLeaseTerm}
            />
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.inputLight}
            placeholder="Neighborhood / Area"
            placeholderTextColor="#777"
            value={locationArea}
            onChangeText={setLocationArea}
          />
        </View>

        {/* UPLOAD PHOTOS (stub only) */}
        <Pressable style={styles.uploadButton} onPress={pickImages}>
          <Text style={styles.uploadButtonText}>Upload photos</Text>
        </Pressable>
      </View>

      {/* Publish button */}
      <Pressable
        style={[
          styles.primaryButton,
          submitting && styles.primaryButtonDisabled,
        ]}
        onPress={handleCreateListing}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryButtonText}>Publish listing</Text>
        )}
      </Pressable>
    </>
  );

  const renderStudentForm = () => (
    <>
      <Text style={styles.title}>Create Post</Text>
      <Text style={styles.subtitle}>
        Tell others what you&apos;re looking for
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Looking for a roommate for Fall 2025"
          placeholderTextColor="#999"
          value={postTitle}
          onChangeText={setPostTitle}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe yourself, your preferences, and what you're looking for."
          placeholderTextColor="#999"
          value={postBody}
          onChangeText={setPostBody}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Future: university, major, budget slider, move-in date, preferred location */}

      <Pressable
        style={[
          styles.primaryButton,
          submitting && styles.primaryButtonDisabled,
        ]}
        onPress={handleCreatePost}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Post</Text>
        )}
      </Pressable>
    </>
  );

  // Loading / role checks
  if (roleLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.centeredText}>Loading...</Text>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>
          Could not determine your role. Please re-login.
        </Text>
      </View>
    );
  }

  return (
    <PageContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "landlord" ? renderLandlordForm() : renderStudentForm()}
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  multilineInput: {
    minHeight: 120,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
  },
  inlineField: {
    flex: 1,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centeredText: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#000",
  },

  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#d0d0d0",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },

  utilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  utilityChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#fff",
  },
  utilityChipSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  utilityChipText: {
    fontSize: 12,
    color: "#333",
  },
  utilityChipTextSelected: {
    color: "#fff",
  },

  inputLight: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#000",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  universitySuggestionBox: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  universitySuggestionText: {
    fontSize: 13,
    color: "#333",
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownChevron: {
    fontSize: 14,
    color: "#555",
  },

  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  toggleChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  toggleChipActive: {
    backgroundColor: "#000",
  },
  toggleChipText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  toggleChipTextActive: {
    color: "#fff",
  },

  uploadButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
