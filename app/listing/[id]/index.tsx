import React from "react";
import {
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
import { Copy, Mail, Pencil, Phone, Trash2, X } from "lucide-react-native";
import { ListingImageGallery } from "@/components/listings/ListingImageGallery";
import { useListingDetail } from "@/hooks/useListingDetail";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader, { HeaderActions, HeaderIconBtn } from "@/components/ui/PageHeader";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

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

  if (loading || !listing) return <LoadingState label="Loading listing…" />;
  if (deleting) return <LoadingState label="Deleting listing…" />;

  const hasCoordinates = listing.latitude != null && listing.longitude != null;

  const headerRight = isOwner ? (
    <HeaderActions>
      <HeaderIconBtn onPress={handleEdit} hitSlop={6}>
        <Pencil color={colors.text.primary} size={18} />
      </HeaderIconBtn>
      <HeaderIconBtn onPress={handleDelete} danger hitSlop={6}>
        <Trash2 color={colors.danger.default} size={18} />
      </HeaderIconBtn>
    </HeaderActions>
  ) : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageHeader title={listing.title} onBack={handleBack} right={headerRight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ListingImageGallery photos={listing.photo_urls ?? []} />

        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.rent}>
            ${listing.rent}
            <Text style={styles.rentSuffix}> / month</Text>
          </Text>

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

          <Text style={styles.address}>{listing.address}</Text>

          <View style={styles.infoCard}>
            {listing.security_deposit != null && (
              <InfoRow label="Security deposit" value={`$${listing.security_deposit}`} />
            )}
            {listing.utilities && <InfoRow label="Utilities" value={listing.utilities} />}
            {listing.move_in_date && (
              <InfoRow label="Move-in date" value={new Date(listing.move_in_date).toLocaleDateString()} />
            )}
            {listing.nearby_university && (
              <InfoRow label="Nearby university" value={listing.nearby_university} last />
            )}
          </View>

          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{listing.description}</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.cardLabel}>Listed by</Text>
            <Text style={styles.cardValue}>{landlordName || "Landlord"}</Text>
          </View>

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
                  <Marker coordinate={{ latitude: listing.latitude!, longitude: listing.longitude! }} />
                )}
              </MapView>
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>📍 No location available</Text>
            </View>
          )}

          {isOwner ? (
            <View style={styles.ownerCTARow}>
              <Pressable style={styles.editBtn} onPress={handleEdit}>
                <Pencil color={colors.black} size={16} />
                <Text style={styles.editBtnText}>Edit Listing</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Trash2 color={colors.danger.default} size={16} />
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
          <Pressable style={styles.modalBackdrop} onPress={() => setContactModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Landlord</Text>
              <Pressable style={styles.modalCloseBtn} onPress={() => setContactModalVisible(false)}>
                <X color={colors.text.primary} size={20} />
              </Pressable>
            </View>

            <View style={styles.landlordHero}>
              <Text style={styles.landlordName}>{landlordName || "Landlord"}</Text>
              <Text style={styles.landlordSubtitle}>Interested in this property?</Text>
            </View>

            <View style={styles.contactOptions}>
              {landlordProfile?.phone_number ? (
                <Pressable style={styles.contactItem} onPress={() => handleCall(landlordProfile.phone_number!)}>
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapper}>
                      <Phone color={colors.text.primary} size={18} />
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
                      <Phone color={colors.text.dim} size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabelDisabled}>Phone Number</Text>
                      <Text style={styles.contactItemValueDisabled}>Not provided</Text>
                    </View>
                  </View>
                </View>
              )}

              {landlordProfile?.email ? (
                <Pressable style={styles.contactItem} onPress={() => handleCopyEmail(landlordProfile.email!)}>
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapper}>
                      <Mail color={colors.text.primary} size={18} />
                    </View>
                    <View>
                      <Text style={styles.contactItemLabel}>Email Address</Text>
                      <Text style={styles.contactItemValue}>{landlordProfile.email}</Text>
                    </View>
                  </View>
                  <View style={styles.actionCopyBtn}>
                    <Copy color={colors.text.primary} size={14} />
                  </View>
                </Pressable>
              ) : (
                <View style={styles.contactItemDisabled}>
                  <View style={styles.contactItemLeft}>
                    <View style={styles.iconWrapperDisabled}>
                      <Mail color={colors.text.dim} size={18} />
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

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
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
    backgroundColor: colors.background.screen,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: typography.weight.bold,
    lineHeight: 28,
  },
  rent: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: typography.weight.extrabold,
  },
  rentSuffix: {
    fontSize: 15,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  detailChip: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm - 2,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  detailChipText: {
    color: colors.text.body,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  address: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardLabel: {
    color: colors.text.faint,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    color: colors.text.value,
    fontSize: 15,
    fontWeight: typography.weight.medium,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    color: colors.text.faint,
    fontSize: typography.size.base,
  },
  infoValue: {
    color: colors.text.value,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  bodyText: {
    color: colors.text.readable,
    fontSize: typography.size.md,
    lineHeight: 22,
  },
  mapContainer: {
    height: 160,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: colors.text.dim,
    fontSize: typography.size.md,
  },
  ownerCTARow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
  },
  editBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: typography.weight.bold,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm - 2,
    backgroundColor: colors.danger.background,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger.border,
  },
  deleteBtnText: {
    color: colors.danger.default,
    fontSize: 15,
    fontWeight: typography.weight.bold,
  },
  ctaButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  ctaButtonText: {
    color: colors.black,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colors.background.modal,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.dim,
    borderBottomWidth: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : spacing.xxl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border.dim,
    alignItems: "center",
    justifyContent: "center",
  },
  landlordHero: {
    marginBottom: spacing.xxl,
  },
  landlordName: {
    color: colors.text.primary,
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
  },
  landlordSubtitle: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    marginTop: spacing.xs,
  },
  contactOptions: {
    gap: spacing.lg,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.elevated,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  contactItemDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    opacity: 0.5,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.dim,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  iconWrapperDisabled: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.dim,
  },
  contactItemLabel: {
    color: colors.text.faint,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  contactItemValue: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginTop: 2,
  },
  contactItemLabelDisabled: {
    color: "#444",
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  contactItemValueDisabled: {
    color: colors.text.faint,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginTop: 2,
  },
  actionLinkText: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  actionCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.sm,
  },
});
