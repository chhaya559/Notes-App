import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignContent: "flex-start",
      backgroundColor: Colors.background,
    },
    heading: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: Colors.textPrimary,
    },
    text: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.textSecondary,
      marginTop: 10,
      marginBottom: 7,
      textAlign: "center",
    },
    innerContainer: {
      alignItems: "center",
      margin: 10,
    },
    pressable: {
      backgroundColor: Colors.primary,
      padding: 15,
      margin: 15,
      borderRadius: 15,
      alignContent: "center",
    },

    pressableText: {
      color: Colors.textPrimary,
      fontWeight: "700",
      fontSize: 18,
      textAlign: "center",
    },
    lineContainer: {
      flexDirection: "row",
      alignItems: "center",
      margin: 5,
    },
    continueText: {
      textAlign: "center",
      marginHorizontal: 10,
      color: Colors.textSecondary,
      fontSize: 14,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: Colors.border,
    },
    google: {
      padding: 15,
      margin: 15,
      borderRadius: 15,
      borderWidth: 1,
      backgroundColor: Colors.primary,
      alignContent: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 7,
    },
    googleText: {
      fontWeight: "700",
      fontSize: 18,
      textAlign: "center",
      color: Colors.textPrimary,
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
