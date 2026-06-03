import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { colors, radius, spacing, typography } from "@/src/constants/theme";

interface PriceRangeModalProps {
  visible: boolean;
  initialMin: number;
  initialMax: number;
  onClose: () => void;
  onApply: (min: number, max: number) => void;
}

export default function PriceRangeModal({
  visible,
  initialMin,
  initialMax,
  onClose,
  onApply,
}: PriceRangeModalProps) {
  const [values, setValues] = useState([initialMin, initialMax]);

  // Reset values when modal opens if needed
  useEffect(() => {
    if (visible) {
      setValues([initialMin, initialMax]);
    }
  }, [visible, initialMin, initialMax]);

  const handleValuesChange = (newValues: number[]) => {
    setValues(newValues);
  };

  const handleApply = () => {
    onApply(values[0], values[1]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Price Range</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.valueText}>
              ${values[0]} - ${values[1]}
              {values[1] === 5000 ? "+" : ""}
            </Text>

            <MultiSlider
              values={[values[0], values[1]]}
              sliderLength={300}
              onValuesChange={handleValuesChange}
              min={0}
              max={5000}
              step={50}
              selectedStyle={{
                backgroundColor: colors.accent.secondary,
              }}
              unselectedStyle={{
                backgroundColor: colors.border.strong,
              }}
              markerStyle={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.accent.secondary,
                height: 24,
                width: 24,
                borderRadius: 12,
                marginTop: 2,
              }}
            />
          </View>

          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xxl,
    paddingBottom: Platform.OS === "ios" ? 40 : spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    color: colors.white,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  closeText: {
    color: colors.text.readable,
    fontSize: typography.size.lg,
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  valueText: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xxl,
  },
  applyButton: {
    backgroundColor: colors.accent.secondary,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
  },
  applyButtonText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});
