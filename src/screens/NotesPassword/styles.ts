import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    pressable: {
      backgroundColor: Colors.primary,
      padding: 10,
      borderRadius: 10,
      margin: 15,
    },
    pressableText: {
      color: Colors.textPrimary,
      textAlign: "center",
      fontSize: 18,
    },
    container: {
      flexDirection: "column",
      gap: 10,
      backgroundColor: Colors.background,
      paddingTop: 20,
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
      color: Colors.textSecondary,
    },
  });

export default styles;
