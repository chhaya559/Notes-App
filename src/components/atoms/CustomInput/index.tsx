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
};
export default function CustomInput({
  text,
  placeholder,
  color,
  value,
  onChangeText,
  onBlur,
  isPassword,
}: Readonly<props>) {
  const [focused, setFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  function onToggleVisibility() {
    setIsVisible((p) => !p);
  }
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
          style={[styles.input, focused && styles.focused]}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          secureTextEntry={isPassword ? !isVisible : false}
          cursorColor="#5757f8"
          selectionColor="#5757f8"
        />
        {isPassword && (
          <Pressable onPress={onToggleVisibility} style={styles.icon}>
            <Ionicons
              name={isVisible ? "eye" : "eye-off"}
              size={22}
              color="#666"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
