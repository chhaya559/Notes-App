import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    gap: 10,
  },
  iconWrap: {
    height: 45,
    width: 45,
    backgroundColor: "#615FFF",
    borderRadius: 50,
    position: "relative",
  },
  image: {
    height: 35,
    width: 35,
    borderRadius: 20,
    position: "absolute",
    left: 5,
    top: 5,
  },
  text: {
    fontSize: 18,
    color: "#5757f8",
    fontWeight: "600",
    alignSelf: "center",
  },
});
export default styles;
