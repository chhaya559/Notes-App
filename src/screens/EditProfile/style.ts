import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    heading: {
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold",
      margin: 10,
    },
    text: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 10,
      color: Colors.textSecondary,
      marginTop: 20,
    },
    pressable: {
      backgroundColor: Colors.primary,
      padding: 15,
      margin: 15,
      borderRadius: 15,
      marginTop: 25,
    },
    pressableText: {
      fontSize: 18,
      color: Colors.textOnPrimary,
      textAlign: "center",
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

export default styles;
