import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //alignContent: "flex-start",
      backgroundColor: Colors.background,
    },
    heading: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 15,
      margin: 10,
      color: Colors.textPrimary,
    },
    text: {
      fontSize: 18,
      fontWeight: "400",
      margin: 10,
      textAlign: "center",
      color: Colors.textSecondary,
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
    navigator: {
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      marginTop: 10,
    },
    backText: {
      fontSize: 16,
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
    modal: {
      height: 300,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.surfaceSoft,
      position: "relative",
      borderRadius: 10,
      padding: 10,
    },
    modalHeading: {
      color: Colors.textPrimary,
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 10,
    },
    modalText: {
      textAlign: "center",
      margin: 10,
      marginTop: 30,
      marginBottom: 40,
      color: Colors.textSecondary,
    },

    modalLogin: {
      color: Colors.textPrimary,
      fontWeight: "400",
      fontSize: 18,
      textAlign: "center",
    },
    iconWrap: {
      backgroundColor: Colors.iconSoftBg,
      padding: 15,
      borderRadius: 50,
    },
    backButtom: {
      backgroundColor: Colors.primary,
      padding: 10,
      marginLeft: 15,
      marginRight: 15,
      width: 200,
      borderRadius: 15,
    },
    cross: {
      position: "absolute",
      right: 15,
      top: 268,
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 25,
    },
  });

export default styles;
