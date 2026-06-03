import React from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Phone, Mail, Copy, X, Pencil, Trash2 } from "lucide-react-native";
import { ListingImageGallery } from "@/components/listings/ListingImageGallery";
import { useListingDetail } from "@/hooks/useListingDetail";

// Dynamic imports for platform-specific map components
let MapView: any;
let Marker: any;
let UrlTile: any;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  UrlTile = maps.UrlTile;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
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
  } = useListingDetail(id);

  if (loading || !listing) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.loadingText}>Loading listing…</Text>
      </SafeAreaView>
    );
  }

  if (deleting) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.loadingText}>Deleting listing…</Text>
      </SafeAreaView>
    );
  }

  const hasCoordinates =
    listing.latitude != null && listing.longitude != null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack}>
          <ChevronLeft color="#fff" size={22} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        {/* Owner actions in header */}
        {isOwner ? (
          <View style={styles.headerActions}>
            <Pressable style={styles.headerIconBtn} onPress={handleEdit} hitSlop={6}>
              <Pencil color="#fff" size={18} />
            </Pressable>
            <Pressable style={[styles.headerIconBtn, styles.headerDeleteBtn]} onPress={handleDelete} hitSlop={6}>
              <Trash2 color="#ff4444" size={18} />
            </Pressable>
          </View>
        ) : (
          <View style={{ width: 40, height: 40 }} />
        )}
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

          {/* Map */}
          {hasCoordinates && MapView ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: listing.latitude!,
                  longitude: listing.longitude!,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                {UrlTile && (
                  <UrlTile
                    urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                    tileSize={256}
                    subdomains={["a", "b", "c", "d"]}
                  />
                )}
                {Marker && (
                  <Marker
                    coordinate={{
                      latitude: listing.latitude!,
                      longitude: listing.longitude!,
                    }}
                  />
                )}
              </MapView>
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>📍 No location available</Text>
            </View>
          )}

          {/* CTA button */}
          {isOwner ? (
            <View style={styles.ownerCTARow}>
              <Pressable style={styles.editBtn} onPress={handleEdit}>
                <Pencil color="#000" size={16} />
                <Text style={styles.editBtnText}>Edit Listing</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Trash2 color="#ff4444" size={16} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.ctaButton} onPress={handleContact}>
              <Text style={styles.ctaButtonText}>Contact landlord</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Contact Landlord Modal */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setContactModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Landlord</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setContactModalVisible(false)}
              >
                <X color="#fff" size={20} />
              </Pressable>
            </View>

            <View style={styles.landlordHero}>
              <Text style={styles.landlordName}>{landlordName || "Landlord"}</Text>
              <Text style={styles.landlordSubtitle}>Interested in this property?</Text>
            </View>

            <View style={styles.contactOptions}>
              {landlordProfile?.phone_number ? (
                <Pressable
                  style={styles.contactItem}
                  onPress={() => handleCall(landlordProfile.phone_number!)}
                >
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapper}>
                      <Phone color="#fff" size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabel}>Phone Number</Text>
                      <Text style={styles.contactItemValue}>{landlordProfile.phone_number}</Text>
                    </View>
                  </View>
                  <Text style={styles.actionLinkText}>Call</Text>
                </Pressable>
              ) : (
                <View style={styles.contactItemDisabled}>
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapperDisabled}>
                      <Phone color="#555" size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabelDisabled}>Phone Number</Text>
                      <Text style={styles.contactItemValueDisabled}>Not provided</Text>
                    </View>
                  </View>
                </View>
              )}

              {landlordProfile?.email ? (
                <Pressable
                  style={styles.contactItem}
                  onPress={() => handleCopyEmail(landlordProfile.email!)}
                >
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapper}>
                      <Mail color="#fff" size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabel}>Email Address</Text>
                      <Text style={styles.contactItemValue}>{landlordProfile.email}</Text>
                    </View>
                  </View>
                  <View style={styles.actionCopyBtn}>
                    <Copy color="#fff" size={14} />
                  </View>
                </Pressable>
              ) : (
                <View style={styles.contactItemDisabled}>
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapperDisabled}>
                      <Mail color="#555" size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabelDisabled}>Email Address</Text>
                      <Text style={styles.contactItemValueDisabled}>Not provided</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  headerDeleteBtn: {
    borderColor: "#3a1a1a",
    backgroundColor: "#1a0a0a",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
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
  mapContainer: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: "#555",
    fontSize: 14,
  },
  // Owner CTA row (Edit + Delete side by side)
  ownerCTARow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
  },
  editBtnText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1a0a0a",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a1515",
  },
  deleteBtnText: {
    color: "#ff4444",
    fontSize: 15,
    fontWeight: "700",
  },
  // Student CTA
  ctaButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  ctaButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",
    borderBottomWidth: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  landlordHero: {
    marginBottom: 24,
  },
  landlordName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  landlordSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  contactOptions: {
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  contactItemDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    opacity: 0.5,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  iconWrapperDisabled: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  contactItemLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  contactItemValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  contactItemLabelDisabled: {
    color: "#444",
    fontSize: 12,
    fontWeight: "500",
  },
  contactItemValueDisabled: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  actionLinkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
