import { Text, TextInput, View, Pressable } from "react-native";
import styles from "./styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";

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
  const { dynamicStyles } = useStyles(styles);
  function onToggleVisibility() {
    setIsVisible((p) => !p);
  }
  const { Colors } = useTheme();
  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.label}>{text}</Text>
      <View style={isPassword && dynamicStyles.passwordWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={color}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.();
          }}
          style={[dynamicStyles.input, focused && dynamicStyles.focused]}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          secureTextEntry={isPassword ? !isVisible : false}
          cursorColor={Colors.primary}
          selectionColor={Colors.primary}
        />
        {isPassword && (
          <Pressable onPress={onToggleVisibility} style={dynamicStyles.icon}>
            <Ionicons
              name={isVisible ? "eye" : "eye-off"}
              size={22}
              color={Colors.iconPrimary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
