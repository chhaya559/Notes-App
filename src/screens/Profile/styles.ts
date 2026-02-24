import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    heading: {
      fontSize: 30,
      textAlign: "center",
      fontWeight: "bold",
    },
    text: {
      fontWeight: "400",
      textAlign: "center",
      fontSize: 18,
      marginTop: 10,
      color: Colors.textSecondary,
    },
    image: {
      height: 100,
      width: 100,
      resizeMode: "cover",
      borderRadius: 50,
    },
    upperContainer: {
      margin: 5,
    },
    editImage: {
      backgroundColor: Colors.iconSoftBg,
      padding: 7,
      borderRadius: 25,
      position: "absolute",
      right: -2,
      bottom: -2,
    },
    deleteImage: {
      backgroundColor: "#E0E7FF",
      padding: 7,
      borderRadius: 25,
      position: "absolute",
      right: 50,
      bottom: 2,
    },
    profile: {
      height: 100,
      width: 100,
      borderRadius: 50,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 15,
      backgroundColor: "white",
    },
    name: {
      textAlign: "center",
      fontSize: 30,
      margin: 10,
      color: Colors.textPrimary,
    },

    view: {
      flexDirection: "row",
      gap: 5,
      margin: 7,
      position: "relative",
      alignSelf: "center",
    },
    viewText: {
      fontSize: 18,
      fontWeight: "300",
    },
    viewIcon: {
      position: "absolute",
      top: 3,
      right: -20,
    },
    email: {
      textAlign: "center",
      color: Colors.textSecondary,
    },
    lowerContainer: {
      marginTop: 30,
    },
    pressable: {
      backgroundColor: Colors.primary,
      margin: 15,
      padding: 15,
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },

    registerText: {
      color: Colors.textOnPrimary,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
    },
    logout: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    bottomsheetContainer: {
      marginLeft: 15,
      margin: 15,
    },
    close: {
      position: "absolute",
      right: -2,
      top: -2,
    },
    line: {
      height: 1,
      backgroundColor: Colors.textSecondary,
      marginLeft: 15,
      marginRight: 15,
    },
    optionsStyle: {
      padding: 10,
      paddingLeft: 20,
      flexDirection: "row",
      alignItems: "center",
      textAlignVertical: "center",
      gap: 20,
    },
    profileText: {
      textAlign: "center",
      color: Colors.primary,
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 20,
    },
    optionText: {
      fontWeight: "600",
      fontSize: 16,
      color: Colors.primary,
    },
    optionsContainer: {
      backgroundColor: Colors.primarySoft,
      borderRadius: 20,
    },
  });
export default styles;
