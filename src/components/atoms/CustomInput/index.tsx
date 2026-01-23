import { Text, TextInput, View, Pressable } from "react-native";
import styles from "./styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type props = {
  text?: string;
  placeholder?: string;
  color?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  isPassword?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  secureTextEntry?: boolean;
};
export default function CustomInput({
  text,
  placeholder,
  color,
  value,
  onChangeText,
  onBlur,
  isPassword,
  isVisible,
  onToggleVisibility,
  secureTextEntry,
}: Readonly<props>) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{text}</Text>
      <View style={isPassword && styles.passwordWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={color}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.();
          }}
          secureTextEntry={secureTextEntry}
          style={[styles.input, focused && styles.focused]}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
        />
        {isPassword && (
          <Pressable onPress={onToggleVisibility} style={styles.icon}>
            <Ionicons
              name={isVisible ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
