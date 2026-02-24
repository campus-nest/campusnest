import FurnishedToggle from "@/components/listings/form/FurnishedToggle";
import LeaseTermSelector from "@/components/listings/form/LeaseTermSelector";
import MoveInDatePicker from "@/components/listings/form/MoveInDatePicker";
import UtilitiesSelector, {
    DEFAULT_UTILITIES,
    Utilities,
} from "@/components/listings/form/UtilitiesSelector";
import { ImagePickerPreview } from "@/components/listings/ImagePickerPreview";
import FormField from "@/components/ui/FormField";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export interface LandlordFormState {
    listingTitle: string;
    listingAddress: string;
    listingRent: string;
    listingLeaseTerm: string;
    utilities: Utilities;
    nearbyUniversity: string;
    description: string;
    tenantPreferences: string;
    leaseTermOption: string | null;
    isFurnished: boolean | null;
    moveInDate: Date | null;
    locationArea: string;
    photoUris: string[];
}

export const DEFAULT_LANDLORD_FORM_STATE: LandlordFormState = {
    listingTitle: "",
    listingAddress: "",
    listingRent: "",
    listingLeaseTerm: "",
    utilities: DEFAULT_UTILITIES,
    nearbyUniversity: "",
    description: "",
    tenantPreferences: "",
    leaseTermOption: null,
    isFurnished: null,
    moveInDate: null,
    locationArea: "",
    photoUris: [],
};

interface LandlordListingFormProps {
    state: LandlordFormState;
    onChange: <K extends keyof LandlordFormState>(
        key: K,
        value: LandlordFormState[K],
    ) => void;
    onPickImages: () => void;
    onSubmit: () => void;
    submitting: boolean;
}

export default function LandlordListingForm({
    state,
    onChange,
    onPickImages,
    onSubmit,
    submitting,
}: LandlordListingFormProps) {
    return (
        <>
            <Text style={styles.title}>Create Listing</Text>
            <Text style={styles.subtitle}>Share a place students can rent</Text>

            <View style={styles.formCard}>
                <View style={styles.cardDivider} />

                <FormField label="Listing Title">
                    <TextInput
                        style={styles.inputLight}
                        placeholder="Cozy 2-bedroom near campus"
                        placeholderTextColor={colors.textDim}
                        value={state.listingTitle}
                        onChangeText={(v) => onChange("listingTitle", v)}
                    />
                </FormField>

                <FormField label="Address">
                    <TextInput
                        style={styles.inputLight}
                        placeholder="123 University Ave"
                        placeholderTextColor={colors.textDim}
                        value={state.listingAddress}
                        onChangeText={(v) => onChange("listingAddress", v)}
                    />
                </FormField>

                <Text style={styles.sectionTitle}>Utilities</Text>
                <UtilitiesSelector
                    value={state.utilities}
                    onChange={(v) => onChange("utilities", v)}
                />

                <FormField label="Nearby University">
                    <TextInput
                        style={styles.inputLight}
                        placeholder="Select college"
                        placeholderTextColor={colors.textDim}
                        value={state.nearbyUniversity}
                        onChangeText={(v) => onChange("nearbyUniversity", v)}
                    />
                    {state.nearbyUniversity.length === 0 && (
                        <Pressable
                            style={styles.universitySuggestion}
                            onPress={() => onChange("nearbyUniversity", "University of Alberta")}
                        >
                            <Text style={styles.universitySuggestionText}>
                                University of Alberta
                            </Text>
                        </Pressable>
                    )}
                </FormField>

                <FormField label="Description">
                    <TextInput
                        style={[styles.inputLight, styles.multilineInput]}
                        placeholder="Tell people about your place"
                        placeholderTextColor={colors.textDim}
                        value={state.description}
                        onChangeText={(v) => onChange("description", v)}
                        multiline
                        textAlignVertical="top"
                    />
                </FormField>

                <FormField label="Tenant Preferences">
                    <TextInput
                        style={[styles.inputLight, styles.multilineInput]}
                        placeholder="What do you look for?"
                        placeholderTextColor={colors.textDim}
                        value={state.tenantPreferences}
                        onChangeText={(v) => onChange("tenantPreferences", v)}
                        multiline
                        textAlignVertical="top"
                    />
                </FormField>

                <FormField label="Lease Term">
                    <LeaseTermSelector
                        value={state.leaseTermOption}
                        onChange={(v) => {
                            onChange("leaseTermOption", v);
                            onChange("listingLeaseTerm", v);
                        }}
                    />
                </FormField>

                <FurnishedToggle
                    value={state.isFurnished}
                    onChange={(v) => onChange("isFurnished", v)}
                />

                <FormField label="Move In Date">
                    <MoveInDatePicker
                        value={state.moveInDate}
                        onChange={(v) => onChange("moveInDate", v)}
                    />
                </FormField>

                <View style={styles.inlineRow}>
                    <View style={styles.inlineField}>
                        <FormField label="Rent / month">
                            <TextInput
                                style={styles.inputLight}
                                placeholder="780"
                                placeholderTextColor={colors.textDim}
                                keyboardType="numeric"
                                value={state.listingRent}
                                onChangeText={(v) => onChange("listingRent", v)}
                            />
                        </FormField>
                    </View>

                    <View style={styles.inlineField}>
                        <FormField label="Lease term (display)">
                            <TextInput
                                style={styles.inputLight}
                                placeholder="8 months"
                                placeholderTextColor={colors.textDim}
                                value={state.listingLeaseTerm}
                                onChangeText={(v) => onChange("listingLeaseTerm", v)}
                            />
                        </FormField>
                    </View>
                </View>

                <FormField label="Location">
                    <TextInput
                        style={styles.inputLight}
                        placeholder="Neighborhood / Area"
                        placeholderTextColor={colors.textDim}
                        value={state.locationArea}
                        onChangeText={(v) => onChange("locationArea", v)}
                    />
                </FormField>

                {state.photoUris.length > 0 && (
                    <ImagePickerPreview
                        photos={state.photoUris}
                        onRemove={(uri) =>
                            onChange(
                                "photoUris",
                                state.photoUris.filter((p) => p !== uri),
                            )
                        }
                    />
                )}

                <Pressable style={styles.uploadButton} onPress={onPickImages}>
                    <Text style={styles.uploadButtonText}>
                        {state.photoUris.length ? "Add more photos" : "Upload photos"}
                    </Text>
                </Pressable>
            </View>

            <Pressable
                style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
                onPress={onSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color={colors.textDark} />
                ) : (
                    <Text style={styles.primaryButtonText}>Publish listing</Text>
                )}
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: typography.fontSizes.xxl,
        fontWeight: typography.fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    formCard: {
        backgroundColor: colors.backgroundLight,
        borderRadius: 24,
        padding: spacing.base,
        marginTop: spacing.sm,
    },
    cardDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#d0d0d0",
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
        color: "#111",
    },
    inputLight: {
        backgroundColor: colors.backgroundWhite,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colors.textDark,
        fontSize: typography.fontSizes.md,
        borderWidth: 1,
        borderColor: colors.borderLight,
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
    universitySuggestion: {
        marginTop: 6,
        borderRadius: 10,
        backgroundColor: colors.backgroundWhite,
        padding: spacing.sm,
        shadowColor: colors.textDark,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    universitySuggestionText: {
        fontSize: typography.fontSizes.base,
        color: colors.textSubtle,
    },
    uploadButton: {
        marginTop: spacing.sm,
        backgroundColor: "#e5e5e5",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },
    uploadButtonText: {
        fontSize: typography.fontSizes.md,
        color: "#333",
    },
    primaryButton: {
        marginTop: spacing.base,
        backgroundColor: colors.backgroundWhite,
        borderRadius: 999,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        fontSize: typography.fontSizes.lg - 1,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textDark,
    },
});
