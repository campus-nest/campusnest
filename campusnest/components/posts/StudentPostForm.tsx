import FormField from "@/components/ui/FormField";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export interface StudentPostFormState {
    postTitle: string;
    postBody: string;
}

export const DEFAULT_STUDENT_POST_STATE: StudentPostFormState = {
    postTitle: "",
    postBody: "",
};

interface StudentPostFormProps {
    state: StudentPostFormState;
    onChange: <K extends keyof StudentPostFormState>(
        key: K,
        value: StudentPostFormState[K],
    ) => void;
    onSubmit: () => void;
    submitting: boolean;
}

export default function StudentPostForm({
    state,
    onChange,
    onSubmit,
    submitting,
}: StudentPostFormProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Post</Text>
            <Text style={styles.subtitle}>Tell others what you&apos;re looking for</Text>

            <FormField label="Title">
                <TextInput
                    style={styles.input}
                    placeholder="Looking for a roommate for Fall 2025"
                    placeholderTextColor={colors.textMuted}
                    value={state.postTitle}
                    onChangeText={(v) => onChange("postTitle", v)}
                />
            </FormField>

            <FormField label="Description">
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Describe yourself, your preferences, and what you're looking for."
                    placeholderTextColor={colors.textMuted}
                    value={state.postBody}
                    onChangeText={(v) => onChange("postBody", v)}
                    multiline
                    textAlignVertical="top"
                />
            </FormField>

            <Pressable
                style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
                onPress={onSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color={colors.textPrimary} />
                ) : (
                    <Text style={styles.primaryButtonText}>Post</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.xs,
    },
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
    input: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colors.textPrimary,
        fontSize: typography.fontSizes.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    multilineInput: {
        minHeight: 120,
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
