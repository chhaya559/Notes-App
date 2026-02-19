import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      margin: 15,
      marginBottom: 5,
      gap: 5,
    },
    label: {
      fontWeight: "medium",
      fontSize: 17,
      color: Colors.textPrimary,
    },
    input: {
      borderWidth: 2,
      borderColor: Colors.border,
      padding: 12,
      borderRadius: 10,
      color: Colors.textPrimary,
    },
    focused: {
      borderColor: Colors.primaryPressed,
      borderWidth: 2,
    },
    passwordWrapper: {
      position: "relative",
    },
    icon: {
      position: "absolute",
      right: 12,
      top: 10,
    },
  });

export default styles;
