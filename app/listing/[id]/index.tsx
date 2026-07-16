import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
import DetailRow from "@/components/ui/DetailRow";
import IconCircle from "@/components/ui/IconCircle";
import Card from "@/components/ui/Card";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.screen }}>
      <PageHeader title={listing.title} onBack={handleBack} right={headerRight} />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxxl }} showsVerticalScrollIndicator={false}>
        <ListingImageGallery photos={listing.photo_urls ?? []} />

        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, gap: spacing.lg }}>
          <Text style={{ color: colors.text.primary, fontSize: typography.size.xxl + 2, fontWeight: typography.weight.bold, lineHeight: 28 }}>
            {listing.title}
          </Text>
          <Text style={{ color: colors.text.primary, fontSize: typography.size.xxxl + 2, fontWeight: typography.weight.extrabold }}>
            ${listing.rent}
            <Text style={{ fontSize: typography.size.md + 1, fontWeight: typography.weight.regular, color: colors.text.secondary }}>
              {" "}/ month
            </Text>
          </Text>

          {(listing.bedrooms != null || listing.bathrooms != null) && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {listing.bedrooms != null && <Tag label={`${listing.bedrooms} bed`} />}
              {listing.bathrooms != null && <Tag label={`${listing.bathrooms} bath`} />}
              {listing.lease_term && <Tag label={listing.lease_term} />}
            </View>
          )}

          <Text style={{ color: colors.text.secondary, fontSize: typography.size.md, lineHeight: 20 }}>
            {listing.address}
          </Text>

          <Card variant="elevated">
            {listing.security_deposit != null && (
              <DetailRow label="Security deposit" value={`$${listing.security_deposit}`} />
            )}
            {listing.utilities && <DetailRow label="Utilities" value={listing.utilities} />}
            {listing.move_in_date && (
              <DetailRow label="Move-in date" value={new Date(listing.move_in_date).toLocaleDateString()} />
            )}
            {listing.nearby_university && (
              <DetailRow label="Nearby university" value={listing.nearby_university} last />
            )}
          </Card>

          {listing.description && (
            <View style={{ gap: spacing.sm }}>
              <Text style={{ color: colors.text.primary, fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
                Description
              </Text>
              <Text style={{ color: colors.text.readable, fontSize: typography.size.md, lineHeight: 22 }}>
                {listing.description}
              </Text>
            </View>
          )}

          <Card variant="elevated">
            <Text
              style={{
                color: colors.text.faint,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.medium,
                marginBottom: spacing.xs,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Listed by
            </Text>
            <Text style={{ color: colors.text.value, fontSize: typography.size.md + 1, fontWeight: typography.weight.medium }}>
              {landlordName || "Landlord"}
            </Text>
          </Card>

          {hasCoordinates && MapView ? (
            <View style={{ height: 160, borderRadius: radius.md, overflow: "hidden", borderWidth: 1, borderColor: colors.border.default }}>
              <MapView
                style={{ flex: 1 }}
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
            <View
              style={{
                height: 160,
                borderRadius: radius.md,
                backgroundColor: colors.background.elevated,
                borderWidth: 1,
                borderColor: colors.border.default,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.text.dim, fontSize: typography.size.md }}>📍 No location available</Text>
            </View>
          )}

          {isOwner ? (
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xs }}>
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: spacing.sm,
                  backgroundColor: colors.white,
                  paddingVertical: spacing.lg,
                  borderRadius: radius.md,
                }}
                onPress={handleEdit}
              >
                <Pencil color={colors.black} size={16} />
                <Text style={{ color: colors.black, fontSize: typography.size.md + 1, fontWeight: typography.weight.bold }}>
                  Edit Listing
                </Text>
              </Pressable>
              <Pressable
                style={{
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
                }}
                onPress={handleDelete}
              >
                <Trash2 color={colors.danger.default} size={16} />
                <Text style={{ color: colors.danger.default, fontSize: typography.size.md + 1, fontWeight: typography.weight.bold }}>
                  Delete
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={{
                backgroundColor: colors.white,
                paddingVertical: spacing.lg,
                borderRadius: radius.md,
                alignItems: "center",
                marginTop: spacing.xs,
              }}
              onPress={handleContact}
            >
              <Text style={{ color: colors.black, fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
                Contact landlord
              </Text>
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
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setContactModalVisible(false)}
          />
          <View
            style={{
              backgroundColor: colors.background.modal,
              borderTopLeftRadius: radius.xxl,
              borderTopRightRadius: radius.xxl,
              padding: spacing.xxl,
              borderWidth: 1,
              borderColor: colors.border.dim,
              borderBottomWidth: 0,
              paddingBottom: Platform.OS === "ios" ? spacing.xxxxl : spacing.xxl,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl }}>
              <Text style={{ color: colors.text.primary, fontSize: typography.size.xxl, fontWeight: typography.weight.bold }}>
                Contact Landlord
              </Text>
              <Pressable onPress={() => setContactModalVisible(false)}>
                <IconCircle size={36} variant="onWhite" style={{ backgroundColor: colors.border.dim }}>
                  <X color={colors.text.primary} size={20} />
                </IconCircle>
              </Pressable>
            </View>

            <View style={{ marginBottom: spacing.xxl }}>
              <Text style={{ color: colors.text.primary, fontSize: typography.size.xxxl, fontWeight: typography.weight.bold }}>
                {landlordName || "Landlord"}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: typography.size.md, marginTop: spacing.xs }}>
                Interested in this property?
              </Text>
            </View>

            <View style={{ gap: spacing.lg }}>
              <ContactMethodRow
                icon={<Phone size={18} />}
                label="Phone Number"
                value={landlordProfile?.phone_number}
                actionLabel="Call"
                onPress={landlordProfile?.phone_number ? () => handleCall(landlordProfile.phone_number!) : undefined}
              />
              <ContactMethodRow
                icon={<Mail size={18} />}
                label="Email Address"
                value={landlordProfile?.email}
                actionIcon={<Copy color={colors.text.primary} size={14} />}
                onPress={landlordProfile?.email ? () => handleCopyEmail(landlordProfile.email!) : undefined}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.background.elevated,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md + 2,
        paddingVertical: spacing.sm - 2,
        borderWidth: 1,
        borderColor: colors.border.default,
      }}
    >
      <Text style={{ color: colors.text.body, fontSize: typography.size.base, fontWeight: typography.weight.medium }}>
        {label}
      </Text>
    </View>
  );
}

function ContactMethodRow({
  icon,
  label,
  value,
  actionLabel,
  actionIcon,
  onPress,
}: {
  icon: React.ReactElement<{ color?: string }>;
  label: string;
  value?: string | null;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onPress?: () => void;
}) {
  const disabled = !onPress;
  const row = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: disabled ? colors.background.modal : colors.background.elevated,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: disabled ? colors.border.subtle : colors.border.default,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <IconCircle variant={disabled ? "disabled" : "subtle"} size={40}>
          {React.cloneElement(icon, { color: disabled ? colors.text.dim : colors.text.primary })}
        </IconCircle>
        <View>
          <Text
            style={{
              color: disabled ? colors.text.disabled : colors.text.faint,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.medium,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              color: disabled ? colors.text.faint : colors.text.primary,
              fontSize: typography.size.md,
              fontWeight: typography.weight.semibold,
              marginTop: spacing.xs - 2,
            }}
          >
            {value || "Not provided"}
          </Text>
        </View>
      </View>
      {!disabled && actionLabel && (
        <Text style={{ color: colors.text.primary, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>
          {actionLabel}
        </Text>
      )}
      {!disabled && actionIcon && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.border.default,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm - 2,
            borderRadius: radius.sm,
          }}
        >
          {actionIcon}
        </View>
      )}
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{row}</Pressable> : row;
}
