import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    outerContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: Colors.background,

      // borderWidth: 10,
    },
    image: {
      height: 150,
      width: 150,
      marginTop: 50,
      borderRadius: 20,
    },
    name: {
      margin: 15,
      fontWeight: "bold",
      fontSize: 25,
      marginTop: 25,
      color: Colors.textPrimary,
    },
    text: {
      fontSize: 15,
      fontWeight: "600",
      color: Colors.textSecondary,
    },
    guest: {
      marginBottom: 10,
      borderRadius: 10,
      padding: 15,
      borderColor: Colors.primaryBorder,
      borderWidth: 1,
      backgroundColor: Colors.surface,
    },
    guestText: {
      color: Colors.primary,
      fontSize: 20,
      textAlign: "center",
      alignItems: "center",
    },
    create: {
      marginBottom: 10,
      borderWidth: 1,
      backgroundColor: Colors.surface,
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      borderColor: Colors.primaryBorder,
    },
    createText: {
      fontSize: 20,
      textAlign: "center",
      color: Colors.primary,
    },
    signin: {
      marginBottom: 10,
      borderRadius: 10,
      padding: 15,
      backgroundColor: Colors.primary,
      alignItems: "center",
      width: "100%",
    },
    signinText: {
      fontSize: 20,
      textAlign: "center",
      color: Colors.textOnPrimary,
    },
    innerContainer: {
      marginTop: 50,
      margin: 20,
      gap: 10,
    },
    container: {
      alignItems: "center",
    },
    footer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
      marginTop: 50,
      alignSelf: "center",
      fontSize: 15,
      color: Colors.textSecondary,
    },
    ai: {
      backgroundColor: Colors.primary,
      padding: 15,
      color: Colors.textOnPrimary,
      borderRadius: 20,
      fontSize: 20,
      marginTop: 20,
      paddingHorizontal: 40,
    },
  });

export default styles;
