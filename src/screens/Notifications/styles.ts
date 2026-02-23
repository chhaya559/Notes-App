import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      padding: 16,
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
      // flexDirection: "row",
      // justifyContent: "space-between",

      // backgroundColor: Colors.surfaceSoft,
      // padding: 2,
      // marginBottom: 20,
      // borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.surface,
      borderRadius: 12,
      paddingVertical: 6,
      paddingHorizontal: 4,
      marginBottom: 15,
    },
    text: {
      color: Colors.textSecondary,
      textAlign: "center",
      fontSize: 16,
      padding: 3,
    },
    focused: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 10,
    },
    touchable: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
      // backgroundColor: Colors.surface,
    },
    activeTouchable: {
      backgroundColor: Colors.primary,
    },
    activeText: {
      color: Colors.textOnPrimary,
      fontWeight: "600",
    },
    line: {
      borderWidth: 1,
      borderColor: Colors.border,
      height: "100%",
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
      color: Colors.textPrimary,
    },
    emptyMessage: {
      fontWeight: "500",
      fontSize: 16,
      color: Colors.textSecondary,
    },
    delete: {
      // position: "absolute",
    },
    swipe: {
      backgroundColor: Colors.swipeDeleteBg,
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
