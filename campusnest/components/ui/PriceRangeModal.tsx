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
                backgroundColor: "#0066CC",
              }}
              unselectedStyle={{
                backgroundColor: "#333",
              }}
              markerStyle={{
                backgroundColor: "#fff",
                borderWidth: 2,
                borderColor: "#0066CC",
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
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  closeText: {
    color: "#999",
    fontSize: 16,
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  valueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  applyButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
