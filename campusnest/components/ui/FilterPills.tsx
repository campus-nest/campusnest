import { Pressable, Text, View } from "react-native";

export interface FilterOption<T extends string> {
  label: string;
  value: T;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <View className="flex-row gap-2 my-3">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={[
              "px-4 py-2 rounded-full border",
              active
                ? "bg-cn-white border-cn-white"
                : "bg-cn-bg border-cn-border",
            ].join(" ")}
          >
            <Text
              className={[
                "text-[13px] font-medium",
                active ? "text-cn-text-dark" : "text-cn-text-primary",
              ].join(" ")}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
