import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: 20,
      alignItems: "center",
      margin: 15,
      paddingBottom: 0,
      marginBottom: 70,
    },
    headingContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    icon: {},
    heading: {
      color: Colors.textPrimary,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    close: {
      position: "absolute",
      right: 12,
      top: 23,
    },
    content: {
      backgroundColor: Colors.surfaceSoft,
      borderRadius: 10,
      padding: 10,
    },
    contentText: {
      fontSize: 16,
      color: Colors.textPrimary,
      textAlign: "justify",
    },
  });

export default styles;
