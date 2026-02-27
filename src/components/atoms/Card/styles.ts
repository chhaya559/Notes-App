import { Dimensions, StyleSheet } from "react-native";
import { ThemeColors } from "@theme/constants";
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const isSmallScreen = screenHeight < 800;

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.surface,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      marginBottom: 10,
      borderRadius: 16,
      height: 90,
      width: screenWidth - 30,
      alignSelf: "center",
      gap: 6,
      // paddingLeft: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.shadowSoft,
      elevation: 2,
      shadowOpacity: 0.2,
    },
    heading: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors.textPrimary,
    },
    contentText: {
      color: Colors.textSecondary,
      // fontSize: 8,
    },
    created: {
      color: Colors.textMuted,
    },

    iconsWrap: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      verticalAlign: "middle",
      position: "absolute",
      right: 20,
      top: 26,
    },
    modal: {
      backgroundColor: Colors.surfaceSoft,
      width: screenWidth * 0.9,
      marginTop: isSmallScreen ? screenHeight * 0.25 : screenHeight * 0.3,
      marginBottom: isSmallScreen ? screenHeight * 0.25 : screenHeight * 0.3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.inputFocusBorder,
    },

    unlockHeading: {
      fontWeight: "600",
      fontSize: 20,
      textAlign: "center",
      color: Colors.textPrimary,
      paddingTop: 10,
      paddingBottom: 0,
    },
    passwordText: {
      marginLeft: 15,
      marginBottom: 0,
    },
    pressable: {
      backgroundColor: Colors.primary,
      margin: 15,
      borderRadius: 15,
      padding: 10,
    },
    pressableText: {
      color: Colors.textOnPrimary,
      padding: 7,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    close: {
      position: "absolute",
      right: 10,
      top: -25,
    },
    counter: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
      marginBottom: 10,
    },
    counterTime: {
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 10,
      width: 45,
      alignItems: "center",
    },
    time: {
      color: Colors.textPrimary,
      padding: 7,
      fontSize: 22,
    },
    textActive: {
      color: Colors.textOnPrimary,
      padding: 7,
      fontSize: 22,
    },
    counterActive: {
      backgroundColor: Colors.primaryPressed,
    },
    timeText: {
      marginLeft: 15,
      marginTop: 15,
      marginBottom: 10,
      fontSize: 18,
      color: Colors.textSecondary,
    },
    swipeAction: {
      flexDirection: "row",
      gap: 10,
      height: 90,
      alignItems: "center",
      justifyContent: "center",
    },

    deleteBg: {
      width: 70,
      height: 80,
      backgroundColor: Colors.swipeDeleteBg,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },

    lockBg: {
      width: 70,
      height: 80,
      backgroundColor: Colors.swipeLockBg,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
  });
export default styles;
