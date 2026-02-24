import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const style = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    heading: {
      fontWeight: "700",
      fontSize: 25,
      textAlign: "center",
      color: Colors.textPrimary,
    },
    text: {
      textAlign: "center",
      fontSize: 18,
      padding: 10,
      fontWeight: "500",
      color: Colors.textSecondary,
    },
    pressable: {
      padding: 15,
      margin: 15,
      backgroundColor: Colors.primary,
      borderRadius: 10,
    },
    pressableText: {
      color: Colors.textOnPrimary,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
    },
    error: {
      textAlign: "left",
      flexDirection: "row",
      gap: 6,
      marginLeft: 20,
      fontSize: 12,
      padding: 5,
      alignSelf: "flex-start",
      borderRadius: 10,
      color: Colors.danger,
    },
  });

export default style;
