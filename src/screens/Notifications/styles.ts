import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      padding: 16,
      paddingTop: 30,
    },
    card: {
      backgroundColor: Colors.surface,
      padding: 15,
      borderRadius: 20,
      borderColor: Colors.border,
      borderWidth: 1,
      marginBottom: 15,
      marginLeft: 5,
      marginRight: 5,
      height: 70,
    },
    icon: {
      alignSelf: "center",
    },

    close: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    modal: {
      padding: 15,
      borderRadius: 12,
      height: 200,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.primaryBorder,
    },

    pressable: {
      padding: 7,
      backgroundColor: Colors.primary,
      borderRadius: 20,
      marginTop: 10,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 15,
      marginLeft: 20,
      marginRight: 20,
    },
    title: {
      textAlign: "center",
      fontWeight: "700",
      margin: 10,
      color: Colors.textPrimary,
    },
    reminderName: {
      fontWeight: "500",
      color: Colors.textPrimary,
    },
    reminderText: {
      color: Colors.textSecondary,
    },
    message: {
      textAlign: "center",
      fontWeight: "500",
      marginBottom: 8,
      color: Colors.textSecondary,
    },
    messageDescription: {
      textAlign: "center",
      fontWeight: "500",
      paddingTop: 10,
      color: Colors.textMuted,
    },
    emptyComponent: {
      alignItems: "center",
    },
    noText: {
      fontWeight: "bold",
      fontSize: 18,
      margin: 10,
    },
    emptyMessage: {
      fontWeight: "500",
      fontSize: 16,
    },
    delete: {
      // position: "absolute",
    },
    swipe: {
      backgroundColor: "#e9e9f1ff",
      padding: 15,
      borderRadius: 20,
      elevation: 3,
      shadowOpacity: 0.2,
      shadowOffset: { width: 2, height: 2 },
      marginBottom: 15,
      marginLeft: 5,
      marginRight: 5,
      height: 70,
    },
  });

export default styles;
