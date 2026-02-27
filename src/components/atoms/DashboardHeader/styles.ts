import { StyleSheet } from "react-native";
import { ThemeColors } from "@theme/constants";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    outer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      height: 56,
    },

    icon: {
      position: "absolute",
      right: 60,
      top: 4,
    },
    profileCover: {
      height: 32,
      width: 32,
      borderRadius: 50,
      backgroundColor: Colors.textOnPrimary,
      borderWidth: 1,
      borderColor: Colors.primaryBorder,
    },

    image: {
      position: "absolute",
      right: 15,
      top: 7,
    },
    profile: {
      height: 30,
      width: 30,
      borderRadius: 50,
      resizeMode: "cover",
    },

    badge: {
      position: "absolute",
      top: -3,
      right: -3,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: Colors.iconSoftBg,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },

    badgeText: {
      color: Colors.textPrimary,
      fontSize: 10,
      fontWeight: "700",
    },
    close: {
      position: "absolute",
      top: -480,
      right: 5,
    },
    modal: {
      padding: 10,
      borderRadius: 12,
      height: 500,
      backgroundColor: "#fefeffff",
      shadowOpacity: 0.7,
    },

    buttons: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });

export default styles;
